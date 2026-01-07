PITCH_RESULT_MAP = {
    'H': 'Hit',
    'S': 'Swing',
    'V': 'Swing (Bunt)', # 헛스윙번트
    'F': 'Foul',
    'W': 'Foul (Bunt)', # 번트파울
    'T': 'Strike',
    'B': 'Ball',
}

PITCH_TYPE_MAP = {
    '직구': 'Four Seam',
    '투심': 'Two Seam',
    '커터': 'Cutter',
    
    '슬라이더': 'Slider',
    '커브': 'Curve',
    '스위퍼': 'Sweeper',
    
    '포크': 'Fork',
    '체인지업': 'Change Up',
    
    '너클볼': 'Knuckle',
}

PITCH_MISS_FEATURES = ['plate_x_ft', 'plate_z_ft', 'pitch_speed_kph', 'ax', 'az', 'ball', 'strike']


SWING_CODES = {'H', 'S', 'V', 'F', 'W'}
CONTACT_CODES = {'H', 'F', 'W'}
WHIFF_CODES = {'S', 'V'}
FOUL_CODES = {'F', 'W'}
NO_SWING_CODES = {'T', 'B'}
#OUT_CODES = {'S', 'V', 'T'}


class Colors:
    RED = '\033[91m'       # High intensity Red
    YELLOW = '\033[93m'    # High intensity Yellow
    ENDC = '\033[0m'       # Reset to default color
    
def log_error(message):
    print(f"{Colors.RED}CRITICAL ERROR: {message}{Colors.ENDC}")

def log_warning(message):
    print(f"{Colors.YELLOW}WARNING: {message}{Colors.ENDC}")

def extract_team_codes(game_id):
    """
    Extracts the 2-character away and home team codes from the game_id string.
    Example: '20250930LTHH02025' -> Away: 'LT', Home: 'HH'
    """
    if len(game_id) < 12:
        return 'N/A', 'N/A' # Handle unexpected format
        
    away_code = game_id[8:10]
    home_code = game_id[10:12]
    
    return away_code, home_code