import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Authenticate users and manage login/registration
    Args: event - dict with httpMethod, body (login/password or registration data)
          context - object with request_id
    Returns: HTTP response with user data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'login')
            
            if action == 'login':
                login = body_data.get('login')
                password = body_data.get('password')
                
                cur.execute(
                    "SELECT id, first_name, last_name, nickname, email, status, balance, is_blocked, avatar_url FROM users WHERE login = %s AND password_hash = %s",
                    (login, password)
                )
                user = cur.fetchone()
                
                if user and not user[7]:
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({
                            'success': True,
                            'user': {
                                'id': user[0],
                                'firstName': user[1],
                                'lastName': user[2],
                                'nickname': user[3],
                                'email': user[4],
                                'status': user[5],
                                'balance': float(user[6]) if user[6] else 0,
                                'avatarUrl': user[8]
                            }
                        })
                    }
                elif user and user[7]:
                    return {
                        'statusCode': 403,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': False, 'error': 'Аккаунт заблокирован'})
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': False, 'error': 'Неверный логин или пароль'})
                    }
            
            elif action == 'register':
                first_name = body_data.get('firstName')
                last_name = body_data.get('lastName')
                login = body_data.get('login')
                nickname = body_data.get('nickname')
                email = body_data.get('email')
                password = body_data.get('password')
                
                cur.execute(
                    "INSERT INTO users (first_name, last_name, login, nickname, email, password_hash, status) VALUES (%s, %s, %s, %s, %s, %s, 'standard') RETURNING id",
                    (first_name, last_name, login, nickname, email, password)
                )
                user_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'userId': user_id})
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
