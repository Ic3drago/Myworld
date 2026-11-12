import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { communities } from '../src/data/communities';
import { events } from '../src/data/events';
import { conversations } from '../src/data/messages';
import { notifications } from '../src/data/notifications';
import { posts } from '../src/data/posts';
import { currentUser, people } from '../src/data/users';

const databasePath = process.env.DATABASE_PATH ?? fileURLToPath(new URL('./nexora.sqlite', import.meta.url));
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT NOT NULL,
    handle TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL,
    gradient TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    interests TEXT NOT NULL DEFAULT '[]',
    games TEXT NOT NULL DEFAULT '[]',
    online INTEGER NOT NULL DEFAULT 1,
    activity TEXT,
    compatibility INTEGER NOT NULL DEFAULT 0,
    location TEXT NOT NULL DEFAULT '',
    role TEXT,
    mutual_communities INTEGER NOT NULL DEFAULT 0,
    preferences TEXT NOT NULL DEFAULT '{"push":true,"email":false,"online":true}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    members INTEGER NOT NULL,
    active_members INTEGER NOT NULL,
    gradient TEXT NOT NULL,
    icon TEXT NOT NULL,
    tags TEXT NOT NULL,
    trending INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS memberships (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, community_id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    community TEXT NOT NULL,
    community_id TEXT NOT NULL,
    date_label TEXT NOT NULL,
    time TEXT NOT NULL,
    participants INTEGER NOT NULL,
    category TEXT NOT NULL,
    gradient TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS event_participants (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    community TEXT,
    time_ago TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('team', 'community', 'share')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS post_likes (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('post', 'community', 'user')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, entity_id)
  );

  CREATE TABLE IF NOT EXISTS connections (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connected_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, connected_user_id),
    CHECK (user_id != connected_user_id)
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_a TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_a, user_b),
    CHECK (user_a != user_b)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    time_text TEXT NOT NULL,
    read_by_recipient INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time_ago TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0
  );
`);

const userColumns = db.pragma('table_info(users)') as Array<{ name: string }>;
if (!userColumns.some((column) => column.name === 'preferences')) {
  db.exec(`ALTER TABLE users ADD COLUMN preferences TEXT NOT NULL DEFAULT '{"push":true,"email":false,"online":true}'`);
}

const seed = db.transaction(() => {
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users
      (id, name, handle, initials, gradient, bio, interests, games, online, activity,
       compatibility, location, role, mutual_communities)
    VALUES (@id, @name, @handle, @initials, @gradient, @bio, @interests, @games, @online,
       @activity, @compatibility, @location, @role, @mutualCommunities)
  `);

  for (const user of [currentUser, ...people]) {
    insertUser.run({
      ...user,
      gradient: JSON.stringify(user.gradient),
      interests: JSON.stringify(user.interests),
      games: JSON.stringify(user.games),
      online: Number(user.online),
      activity: user.activity ?? null,
      role: user.role ?? null,
      mutualCommunities: user.mutualCommunities ?? 0,
    });
  }

  const insertCommunity = db.prepare(`
    INSERT OR IGNORE INTO communities
      (id, name, description, category, members, active_members, gradient, icon, tags, trending)
    VALUES (@id, @name, @description, @category, @members, @activeMembers, @gradient, @icon, @tags, @trending)
  `);
  for (const community of communities) {
    insertCommunity.run({
      ...community,
      gradient: JSON.stringify(community.gradient),
      tags: JSON.stringify(community.tags),
      trending: Number(Boolean(community.trending)),
    });
  }

  const insertEvent = db.prepare(`
    INSERT OR IGNORE INTO events
      (id, title, community, community_id, date_label, time, participants, category, gradient, description)
    VALUES (@id, @title, @community, @communityId, @dateLabel, @time, @participants, @category, @gradient, @description)
  `);
  for (const event of events) {
    insertEvent.run({ ...event, gradient: JSON.stringify(event.gradient) });
  }

  const insertPost = db.prepare(`
    INSERT OR IGNORE INTO posts
      (id, author_id, community, time_ago, content, tags, likes, comments, type)
    VALUES (@id, @authorId, @community, @timeAgo, @content, @tags, @likes, @comments, @type)
  `);
  for (const post of posts) {
    insertPost.run({ ...post, tags: JSON.stringify(post.tags) });
  }

  const insertConversation = db.prepare(
    'INSERT OR IGNORE INTO conversations (id, user_a, user_b) VALUES (?, ?, ?)',
  );
  const insertMessage = db.prepare(`
    INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, text, time_text, read_by_recipient)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const conversation of conversations) {
    insertConversation.run(conversation.id, currentUser.id, conversation.participantId);
    for (const message of conversation.messages) {
      insertMessage.run(
        `${conversation.id}-${message.id}`,
        conversation.id,
        message.senderId,
        message.text,
        message.time,
        Number(message.mine),
      );
    }
  }

  const insertNotification = db.prepare(`
    INSERT OR IGNORE INTO notifications
      (id, user_id, kind, title, description, time_ago, read)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const notification of notifications) {
    insertNotification.run(
      notification.id,
      currentUser.id,
      notification.kind,
      notification.title,
      notification.description,
      notification.timeAgo,
      Number(notification.read),
    );
  }
});

seed();

export function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}