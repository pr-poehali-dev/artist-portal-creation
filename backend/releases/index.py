import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage releases - create, update, list, moderate
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id
    Returns: HTTP response with release data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            user_id = params.get('userId')
            status = params.get('status')
            
            query = "SELECT id, user_id, title, cover_url, genre, subgenre, release_date, status, created_at FROM releases WHERE 1=1"
            query_params = []
            
            if user_id:
                query += " AND user_id = %s"
                query_params.append(user_id)
            
            if status:
                query += " AND status = %s"
                query_params.append(status)
            
            query += " ORDER BY created_at DESC"
            
            cur.execute(query, tuple(query_params))
            releases = cur.fetchall()
            
            result = []
            for r in releases:
                result.append({
                    'id': r[0],
                    'userId': r[1],
                    'title': r[2],
                    'coverUrl': r[3],
                    'genre': r[4],
                    'subgenre': r[5],
                    'releaseDate': r[6].isoformat() if r[6] else None,
                    'status': r[7],
                    'createdAt': r[8].isoformat() if r[8] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'releases': result})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """INSERT INTO releases (user_id, title, genre, subgenre, auto_date, preorder, availability, status)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, 'draft') RETURNING id""",
                (
                    body_data.get('userId'),
                    body_data.get('title'),
                    body_data.get('genre'),
                    body_data.get('subgenre'),
                    body_data.get('autoDate', False),
                    body_data.get('preorder', False),
                    body_data.get('availability', 'cis')
                )
            )
            release_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'releaseId': release_id})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            release_id = body_data.get('releaseId')
            action = body_data.get('action', 'update')
            
            if action == 'submit':
                cur.execute(
                    "UPDATE releases SET status = 'moderation', submitted_at = %s WHERE id = %s",
                    (datetime.now(), release_id)
                )
            elif action == 'approve':
                cur.execute(
                    "UPDATE releases SET status = 'published', published_at = %s WHERE id = %s",
                    (datetime.now(), release_id)
                )
            elif action == 'reject':
                cur.execute(
                    "UPDATE releases SET status = 'rejected', rejection_reason = %s, can_resubmit = %s WHERE id = %s",
                    (body_data.get('reason'), body_data.get('canResubmit', True), release_id)
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
