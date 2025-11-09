CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'standard',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_platforms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL,
    profile_url VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    cover_url VARCHAR(500),
    genre VARCHAR(100),
    subgenre VARCHAR(100),
    upc VARCHAR(50),
    release_date DATE,
    auto_date BOOLEAN DEFAULT FALSE,
    preorder BOOLEAN DEFAULT FALSE,
    availability VARCHAR(20) DEFAULT 'cis',
    status VARCHAR(20) DEFAULT 'draft',
    rejection_reason TEXT,
    can_resubmit BOOLEAN DEFAULT TRUE,
    submitted_at TIMESTAMP,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE release_artists (
    id SERIAL PRIMARY KEY,
    release_id INTEGER NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    user_id INTEGER,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    release_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    file_url VARCHAR(500),
    lyrics_author VARCHAR(255),
    music_author VARCHAR(255),
    has_no_lyrics BOOLEAN DEFAULT FALSE,
    language VARCHAR(50),
    isrc VARCHAR(50),
    has_explicit BOOLEAN DEFAULT FALSE,
    has_drugs BOOLEAN DEFAULT FALSE,
    is_focus BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE release_services (
    id SERIAL PRIMARY KEY,
    release_id INTEGER NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'service',
    author_id INTEGER,
    cover_url VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_likes (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, user_id)
);

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'open',
    rating INTEGER,
    rating_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE TABLE ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER,
    is_admin BOOLEAN DEFAULT FALSE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_releases_user_id ON releases(user_id);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_tracks_release_id ON tracks(release_id);
CREATE INDEX idx_news_type ON news(type);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

INSERT INTO users (first_name, last_name, login, nickname, email, password_hash, status, balance) 
VALUES ('Admin', 'MusicHub', 'admin', 'Администратор', 'admin@musichub.com', 'admin123', 'admin', 0);

INSERT INTO news (title, content, type, author_id) VALUES
('Добро пожаловать в MusicHub!', 'Платформа для дистрибуции музыки теперь доступна. Загружайте свои релизы и делитесь музыкой с миром!', 'service', 1),
('Обновление платформы v2.0', 'Мы добавили новые функции модерации и улучшили интерфейс загрузки треков.', 'service', 1),
('Новые функции модерации', 'Теперь артисты могут отслеживать статус модерации в реальном времени.', 'service', 1);
