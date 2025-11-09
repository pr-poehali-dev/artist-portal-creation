import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage news articles - create, list, like
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id
    Returns: HTTP response with news data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            news_type = params.get('type')
            user_id = params.get('userId')
            
            if user_id and params.get('liked') == 'true':
                cur.execute(
                    """SELECT n.id, n.title, n.content, n.type, n.published_at, COUNT(nl.id) as likes
                       FROM news n
                       LEFT JOIN news_likes nl ON n.id = nl.news_id
                       INNER JOIN news_likes user_likes ON n.id = user_likes.news_id AND user_likes.user_id = %s
                       WHERE n.is_published = true
                       GROUP BY n.id
                       ORDER BY n.published_at DESC""",
                    (user_id,)
                )
            else:
                query = """SELECT n.id, n.title, n.content, n.type, n.published_at, COUNT(nl.id) as likes
                           FROM news n
                           LEFT JOIN news_likes nl ON n.id = nl.news_id
                           WHERE n.is_published = true"""
                query_params = []
                
                if news_type:
                    query += " AND n.type = %s"
                    query_params.append(news_type)
                
                query += " GROUP BY n.id ORDER BY n.published_at DESC"
                
                cur.execute(query, tuple(query_params))
            
            news_list = cur.fetchall()
            
            result = []
            for n in news_list:
                result.append({
                    'id': n[0],
                    'title': n[1],
                    'content': n[2],
                    'type': n[3],
                    'publishedAt': n[4].isoformat() if n[4] else None,
                    'likes': n[5]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'news': result})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'create')
            
            if action == 'create':
                cur.execute(
                    """INSERT INTO news (title, content, type, author_id, published_at)
                       VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                    (
                        body_data.get('title'),
                        body_data.get('content'),
                        body_data.get('type', 'service'),
                        body_data.get('authorId'),
                        datetime.now()
                    )
                )
                news_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'newsId': news_id})
                }
            
            elif action == 'like':
                news_id = body_data.get('newsId')
                user_id = body_data.get('userId')
                
                cur.execute(
                    "INSERT INTO news_likes (news_id, user_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (news_id, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True})
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
