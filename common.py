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
NO_SWING_CODES = {'T', 'B'}
#OUT_CODES = {'S', 'V', 'T'}