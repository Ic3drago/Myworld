import { randomUUID } from 'node:crypto';
import express, { type Request, type RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, parseJson } from './db';
import type { Community, EventItem, Post, User } from '../src/types';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface UserRow {
  id: string;
  email: string | null;
  password_hash: string | null;
  name: string;
  handle: string;
  initials: string;
  gradient: string;
  bio: string;
  interests: string;
  games: string;
  online: number;
  activity: string | null;
  compatibility: number;
  location: string;
  role: string | null;
  mutual_communities: number;
  preferences: string;
}

interface CommunityRow {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  active_members: number;
  gradient: string;
  icon: string;
  tags: string;
  trending: number;
}

interface EventRow {
  id: string;
  title: string;
  community: string;
  community_id: string;
  date_label: string;
  time: string;
  participant_count: number;
  category: string;
  gradient: string;
  description: string;
  joined: number;
}

interface PostRow {
  id: string;
  author_id: string;
  author_name: string;
  author_initials: string;
  author_gradient: string;
  community: string | null;
  time_ago: string;
  content: string;
  tags: string;
  like_count: number;
  comments: number;
  liked: number;
  type: string;
}

const app = express();
const port = Number(process.env.API_PORT ?? 3001);
const cookieName = 'nexora_session';
const sessionSecret = process.env.SESSION_SECRET ?? 'local-development-secret-change-before-deploying';

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET es obligatorio en producción.');
}

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    initials: row.initials,
    gradient: parseJson<[string, string]>(row.gradient),
    bio: row.bio,
    interests: parseJson<string[]>(row.interests),
    games: parseJson<string[]>(row.games),
    online: Boolean(row.online),
    activity: row.activity ?? undefined,
    compatibility: row.compatibility,
    location: row.location,
    role: row.role ?? undefined,
    mutualCommunities: row.mutual_communities,
  };
}

function findUser(id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function setSessionCookie(res: express.Response, id: string) {
  const token = jwt.sign({}, sessionSecret, { subject: id, expiresIn: '7d' });
  res.cookie(cookieName, token, authCookieOptions());
}

const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[cookieName] as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'Inicia sesión para continuar.' });
    return;
  }

  try {
    const payload = jwt.verify(token, sessionSecret);
    if (typeof payload === 'string' || !payload.sub || !findUser(payload.sub)) {
      res.status(401).json({ error: 'La sesión ya no es válida.' });
      return;
    }
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'La sesión ya no es válida.' });
  }
};

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  handle: z.string().trim().min(3).max(24).regex(/^@?[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72),
});

const postSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
  type: z.enum(['team', 'community', 'share']),
});

const messageSchema = z.object({ text: z.string().trim().min(1).max(2000) });
const favoriteSchema = z.object({
  entityId: z.string().min(1).max(100),
  entityType: z.enum(['post', 'community', 'user']),
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/register', (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Revisa nombre, correo, usuario y contraseña.' });
    return;
  }

  const { name, email, password } = parsed.data;
  const handle = `@${parsed.data.handle.replace(/^@/, '')}`;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const id = randomUUID();

  try {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, handle, initials, gradient)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      email,
      bcrypt.hashSync(password, 12),
      name,
      handle,
      initials,
      JSON.stringify(['#0f766e', '#38bdf8']),
    );
    setSessionCookie(res, id);
    res.status(201).json({ user: toUser(findUser(id)!) });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Ese correo o nombre de usuario ya está registrado.' });
      return;
    }
    res.status(500).json({ error: 'No se pudo crear la cuenta.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Introduce un correo y una contraseña válidos.' });
    return;
  }

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(parsed.data.email) as UserRow | undefined;
  if (!row?.password_hash || !bcrypt.compareSync(parsed.data.password, row.password_hash)) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    return;
  }

  setSessionCookie(res, row.id);
  res.json({ user: toUser(row) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', path: '/' });
  res.status(204).end();
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const row = findUser(req.userId!);
  if (!row) {
    res.status(401).json({ error: 'La sesión ya no es válida.' });
    return;
  }
  res.json({ user: toUser(row) });
});

app.use('/api', requireAuth);

app.get('/api/bootstrap', (req, res) => {
  const userId = req.userId!;
  const user = findUser(userId);
  if (!user) {
    res.status(401).json({ error: 'La sesión ya no es válida.' });
    return;
  }

  const peopleRows = db.prepare('SELECT * FROM users WHERE id != ? ORDER BY name').all(userId) as UserRow[];
  const communityRows = db.prepare(`
    SELECT c.*, c.members + COUNT(m.user_id) AS member_count
    FROM communities c LEFT JOIN memberships m ON m.community_id = c.id
    GROUP BY c.id ORDER BY c.name
  `).all() as CommunityRow[];
  const eventRows = db.prepare(`
    SELECT e.*, e.participants + COUNT(ep.user_id) AS participant_count,
      EXISTS (SELECT 1 FROM event_participants mine WHERE mine.event_id = e.id AND mine.user_id = ?) AS joined
    FROM events e LEFT JOIN event_participants ep ON ep.event_id = e.id
    GROUP BY e.id ORDER BY e.rowid
  `).all(userId) as EventRow[];
  const postRows = db.prepare(`
    SELECT p.*, u.name AS author_name, u.initials AS author_initials, u.gradient AS author_gradient,
      (p.likes + COUNT(DISTINCT l.user_id)) AS like_count,
      EXISTS (SELECT 1 FROM post_likes mine WHERE mine.post_id = p.id AND mine.user_id = ?) AS liked
    FROM posts p JOIN users u ON u.id = p.author_id
    LEFT JOIN post_likes l ON l.post_id = p.id
    GROUP BY p.id ORDER BY p.created_at DESC, p.rowid DESC
  `).all(userId) as PostRow[];
  const notificationsRows = db.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY rowid DESC',
  ).all(userId) as Array<Record<string, unknown>>;
  const conversationRows = db.prepare(`
    SELECT c.id, CASE WHEN c.user_a = ? THEN c.user_b ELSE c.user_a END AS participant_id,
      SUM(CASE WHEN m.sender_id != ? AND m.read_by_recipient = 0 THEN 1 ELSE 0 END) AS unread
    FROM conversations c LEFT JOIN messages m ON m.conversation_id = c.id
    WHERE c.user_a = ? OR c.user_b = ? GROUP BY c.id ORDER BY MAX(m.rowid) DESC, c.created_at DESC
  `).all(userId, userId, userId, userId) as Array<Record<string, unknown>>;

  const conversationData = conversationRows.map((conversation) => {
    const participant = findUser(String(conversation.participant_id));
    const messages = db.prepare(`
      SELECT id, sender_id, text, time_text FROM messages
      WHERE conversation_id = ? ORDER BY rowid
    `).all(conversation.id) as Array<Record<string, unknown>>;
    return {
      id: conversation.id,
      participantId: participant?.id ?? '',
      participantName: participant?.name ?? 'Usuario',
      participantInitials: participant?.initials ?? 'U',
      gradient: participant ? parseJson<[string, string]>(participant.gradient) : ['#0f766e', '#38bdf8'],
      online: Boolean(participant?.online),
      activity: participant?.activity ?? undefined,
      unread: Number(conversation.unread ?? 0),
      messages: messages.map((message) => ({
        id: message.id,
        senderId: message.sender_id,
        text: message.text,
        time: message.time_text,
        mine: message.sender_id === userId,
      })),
    };
  });

  const idsFor = (query: string) =>
    (db.prepare(query).all(userId) as Array<{ id: string }>).map((row) => row.id);
  const favorites = (db.prepare('SELECT entity_id AS id FROM favorites WHERE user_id = ?').all(userId) as Array<{ id: string }>).map((row) => row.id);

  const result = {
    user: toUser(user),
    people: peopleRows.map(toUser),
    communities: communityRows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category as Community['category'],
      members: Number(row.member_count),
      activeMembers: row.active_members,
      gradient: parseJson<[string, string]>(String(row.gradient)),
      icon: row.icon as Community['icon'],
      tags: parseJson<string[]>(String(row.tags)),
      trending: Boolean(row.trending),
    })) satisfies Community[],
    events: eventRows.map((row) => ({
      id: row.id,
      title: row.title,
      community: row.community,
      communityId: row.community_id,
      dateLabel: row.date_label,
      time: row.time,
      participants: Number(row.participant_count),
      category: row.category,
      gradient: parseJson<[string, string]>(String(row.gradient)),
      description: row.description,
      joined: Boolean(row.joined),
    })) satisfies EventItem[],
    posts: postRows.map((row) => ({
      id: row.id,
      authorId: row.author_id,
      authorName: row.author_name,
      authorInitials: row.author_initials,
      authorGradient: parseJson<[string, string]>(String(row.author_gradient)),
      community: row.community ?? undefined,
      timeAgo: row.time_ago,
      content: row.content,
      tags: parseJson<string[]>(String(row.tags)),
      likes: Number(row.like_count),
      comments: row.comments,
      liked: Boolean(row.liked),
      type: row.type as Post['type'],
    })) satisfies Post[],
    notifications: notificationsRows.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      description: row.description,
      timeAgo: row.time_ago,
      read: Boolean(row.read),
    })),
    conversations: conversationData,
    connections: idsFor('SELECT connected_user_id AS id FROM connections WHERE user_id = ?'),
    joinedCommunities: idsFor('SELECT community_id AS id FROM memberships WHERE user_id = ?'),
    favorites,
    joinedEvents: idsFor('SELECT event_id AS id FROM event_participants WHERE user_id = ?'),
    likedPosts: idsFor('SELECT post_id AS id FROM post_likes WHERE user_id = ?'),
    activeConversationId: conversationData[0]?.id ?? null,
    unreadMessageCount: conversationData.reduce((sum, conversation) => sum + conversation.unread, 0),
    unreadNotificationCount: notificationsRows.filter((notification) => !notification.read).length,
    preferences: parseJson<{ push: boolean; email: boolean; online: boolean }>(user.preferences),
  };

  res.json(result);
});

app.patch('/api/me', (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(2).max(50),
    handle: z.string().trim().min(4).max(25).regex(/^@[a-zA-Z0-9_]+$/),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Revisa el nombre y el usuario.' });
    return;
  }
  const initials = parsed.data.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  try {
    db.prepare('UPDATE users SET name = ?, handle = ?, initials = ? WHERE id = ?').run(
      parsed.data.name,
      parsed.data.handle,
      initials,
      req.userId,
    );
    res.json({ user: toUser(findUser(req.userId!)!) });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Ese nombre de usuario ya está en uso.' });
      return;
    }
    res.status(500).json({ error: 'No se pudo actualizar el perfil.' });
  }
});

app.patch('/api/preferences', (req, res) => {
  const parsed = z.object({ push: z.boolean(), email: z.boolean(), online: z.boolean() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Las preferencias no son válidas.' });
    return;
  }
  db.prepare('UPDATE users SET preferences = ?, online = ? WHERE id = ?')
    .run(JSON.stringify(parsed.data), Number(parsed.data.online), req.userId);
  res.status(204).end();
});

app.post('/api/connections/:id/toggle', (req, res) => {
  const userId = req.userId!;
  const targetId = String(req.params.id);
  if (userId === targetId || !findUser(targetId)) {
    res.status(404).json({ error: 'No se encontró ese perfil.' });
    return;
  }
  const existing = db.prepare(
    'SELECT 1 FROM connections WHERE user_id = ? AND connected_user_id = ?',
  ).get(userId, targetId);
  if (existing) {
    db.prepare('DELETE FROM connections WHERE user_id = ? AND connected_user_id = ?').run(userId, targetId);
  } else {
    const createConnection = db.transaction(() => {
      db.prepare('INSERT INTO connections (user_id, connected_user_id) VALUES (?, ?)').run(userId, targetId);
      const [userA, userB] = [userId, targetId].sort();
      db.prepare('INSERT OR IGNORE INTO conversations (id, user_a, user_b) VALUES (?, ?, ?)')
        .run(randomUUID(), userA, userB);
    });
    createConnection();
  }
  res.status(204).end();
});

app.post('/api/communities/:id/membership', (req, res) => {
  const communityId = String(req.params.id);
  const found = db.prepare('SELECT 1 FROM communities WHERE id = ?').get(communityId);
  if (!found) {
    res.status(404).json({ error: 'No se encontró esa comunidad.' });
    return;
  }
  db.prepare('INSERT OR IGNORE INTO memberships (user_id, community_id) VALUES (?, ?)')
    .run(req.userId, communityId);
  res.status(204).end();
});

app.delete('/api/communities/:id/membership', (req, res) => {
  db.prepare('DELETE FROM memberships WHERE user_id = ? AND community_id = ?')
    .run(req.userId, String(req.params.id));
  res.status(204).end();
});

app.post('/api/events/:id/join', (req, res) => {
  const eventId = String(req.params.id);
  if (!db.prepare('SELECT 1 FROM events WHERE id = ?').get(eventId)) {
    res.status(404).json({ error: 'No se encontró ese evento.' });
    return;
  }
  db.prepare('INSERT OR IGNORE INTO event_participants (user_id, event_id) VALUES (?, ?)')
    .run(req.userId, eventId);
  res.status(204).end();
});

app.post('/api/favorites/toggle', (req, res) => {
  const parsed = favoriteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'El elemento a guardar no es válido.' });
    return;
  }
  const { entityId, entityType } = parsed.data;
  const table = entityType === 'post' ? 'posts' : entityType === 'community' ? 'communities' : 'users';
  if (!db.prepare(`SELECT 1 FROM ${table} WHERE id = ?`).get(entityId)) {
    res.status(404).json({ error: 'No se encontró el elemento.' });
    return;
  }
  const existing = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND entity_id = ?')
    .get(req.userId, entityId);
  if (existing) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND entity_id = ?').run(req.userId, entityId);
  } else {
    db.prepare('INSERT INTO favorites (user_id, entity_id, entity_type) VALUES (?, ?, ?)')
      .run(req.userId, entityId, entityType);
  }
  res.status(204).end();
});

app.post('/api/posts/:id/like/toggle', (req, res) => {
  const postId = String(req.params.id);
  if (!db.prepare('SELECT 1 FROM posts WHERE id = ?').get(postId)) {
    res.status(404).json({ error: 'No se encontró esa publicación.' });
    return;
  }
  const existing = db.prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?')
    .get(req.userId, postId);
  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(req.userId, postId);
  } else {
    db.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)').run(req.userId, postId);
  }
  res.status(204).end();
});

app.post('/api/posts', (req, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Escribe una publicación válida.' });
    return;
  }
  const id = randomUUID();
  db.prepare(`
    INSERT INTO posts (id, author_id, time_ago, content, tags, likes, comments, type)
    VALUES (?, ?, 'Ahora', ?, ?, 0, 0, ?)
  `).run(id, req.userId, parsed.data.content, JSON.stringify(parsed.data.tags), parsed.data.type);
  res.status(201).json({ id });
});

app.post('/api/conversations/:id/read', (req, res) => {
  const conversationId = String(req.params.id);
  const conversation = db.prepare(`
    SELECT 1 FROM conversations WHERE id = ? AND (user_a = ? OR user_b = ?)
  `).get(conversationId, req.userId, req.userId);
  if (!conversation) {
    res.status(404).json({ error: 'No se encontró esa conversación.' });
    return;
  }
  db.prepare(`
    UPDATE messages SET read_by_recipient = 1
    WHERE conversation_id = ? AND sender_id != ?
  `).run(conversationId, req.userId);
  res.status(204).end();
});

app.post('/api/conversations/:id/messages', (req, res) => {
  const conversationId = String(req.params.id);
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'El mensaje no puede estar vacío ni superar 2000 caracteres.' });
    return;
  }
  const conversation = db.prepare(`
    SELECT 1 FROM conversations WHERE id = ? AND (user_a = ? OR user_b = ?)
  `).get(conversationId, req.userId, req.userId);
  if (!conversation) {
    res.status(404).json({ error: 'No se encontró esa conversación.' });
    return;
  }
  const time = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, text, time_text, read_by_recipient)
    VALUES (?, ?, ?, ?, ?, 0)
  `).run(randomUUID(), conversationId, req.userId, parsed.data.text, time);
  res.status(201).end();
});

app.post('/api/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?')
    .run(String(req.params.id), req.userId);
  res.status(204).end();
});

app.post('/api/notifications/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.userId);
  res.status(204).end();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`NEXORA API escuchando en http://localhost:${port}`);
});