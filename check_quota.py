import os
import pickle
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
]

def check_quota():
    creds = None
    token_file = 'token.pickle'

    if os.path.exists(token_file):
        with open(token_file, 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open(token_file, 'wb') as token:
            pickle.dump(creds, token)

    youtube = build('youtube', 'v3', credentials=creds)

    try:
        request = youtube.channels().list(
            part='snippet,statistics',
            mine=True
        )
        response = request.execute()

        print("✅ YouTube API quota is available!")
        print(f"   Channel: {response['items'][0]['snippet']['title'] if response['items'] else 'Unknown'}")
        print("   You can proceed with video uploads.")
        return True

    except HttpError as e:
        if 'quotaExceeded' in str(e):
            print("❌ YouTube API Quota Exceeded!")
            print("   Your daily quota limit has been reached.")
            print("   ")
            print("   Solutions:")
            print("   1. Wait until midnight Pacific Time for quota reset")
            print("   2. Increase your quota limit in Google Cloud Console:")
            print("      - Go to https://console.cloud.google.com/")
            print("      - Find your project → YouTube Data API v3 → Quotas")
            print("      - Request quota increase (up to 10M units/day)")
            print("   3. Each video upload costs ~1,600 quota units")
            print("   ")
            return False
        else:
            print(f"⚠ YouTube API Error: {e}")
            return False
    except Exception as e:
        print(f"⚠ Error checking quota: {e}")
        return False

if __name__ == '__main__':
    print("🔍 Checking YouTube API Quota Status...")
    print("=" * 50)
    check_quota()