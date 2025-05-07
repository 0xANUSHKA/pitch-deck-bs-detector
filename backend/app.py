from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

# Enhanced buzzword lists
BUZZWORDS = {
    'tech': ['blockchain', 'ai', 'machine learning', 'neural network', 'cloud-native', 'quantum', 
             'web3', 'metaverse', 'crypto', 'nft', 'decentralized', 'autonomous'],
    'business': ['synergy', 'disrupt', 'pivot', 'unicorn', 'growth-hack', 'scale',
                 'leverage', 'optimize', 'streamline', 'paradigm', 'ecosystem'],
    'marketing': ['revolutionary', 'game-changing', 'cutting-edge', 'innovative', 'next-gen',
                 'breakthrough', 'transformative', 'holistic', 'seamless'],
    'vague': ['solution', 'platform', 'framework', 'infrastructure', 'architecture',
              'experience', 'interface', 'strategy', 'roadmap']
}

FILLERS = ['basically', 'actually', 'literally', 'just', 'really', 'very', 'quite',
           'totally', 'absolutely', 'essentially', 'fundamentally']

RED_FLAGS = [
    'guaranteed success', 'unlimited potential', '100%', 'zero risk', 'no downside',
    'revolutionary', 'never before seen', 'game-changing', 'disrupt the industry',
    'market leader', 'industry first', 'best in class', 'world class'
]

def analyze_text(text):
    text = text.lower()
    words = re.findall(r'\b\w+\b', text)
    total_words = len(words)
    
    # Basic stats
    stats = {
        'total_words': total_words,
        'buzzword_counts': {k: 0 for k in BUZZWORDS.keys()},
        'filler_count': 0,
        'red_flags': []
    }
    
    # Count buzzwords by category
    for category, words_list in BUZZWORDS.items():
        for word in words_list:
            if word in text:
                stats['buzzword_counts'][category] += 1
    
    # Count filler words
    stats['filler_count'] = sum(1 for word in FILLERS if word in text)
    
    # Check for red flag phrases
    stats['red_flags'] = [flag for flag in RED_FLAGS if flag in text]
    
    # Sentiment analysis
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    
    # Calculate bullshit score
    total_buzzwords = sum(stats['buzzword_counts'].values())
    buzzword_penalty = min(total_buzzwords * 15, 50)  # Max 50 points from buzzwords
    filler_penalty = min(stats['filler_count'] * 5, 20)  # Max 20 points from fillers
    red_flag_penalty = min(len(stats['red_flags']) * 10, 20)  # Max 20 points from red flags
    
    # Overly positive sentiment adds to bullshit score
    sentiment_penalty = max(0, int((sentiment - 0.2) * 20)) if sentiment > 0.2 else 0
    
    bullshit_score = min(
        buzzword_penalty + filler_penalty + red_flag_penalty + sentiment_penalty,
        100
    )
    
    # Generate analysis reasons
    reasons = []
    if total_buzzwords > 0:
        for category, count in stats['buzzword_counts'].items():
            if count > 0:
                reasons.append(f"Found {count} {category} buzzwords")
    
    if stats['filler_count'] > 0:
        reasons.append(f"Detected {stats['filler_count']} filler words")
    
    if stats['red_flags']:
        reasons.append(f"Found {len(stats['red_flags'])} suspicious claims")
    
    if sentiment > 0.5:
        reasons.append("Overly positive language detected")
    
    if not reasons:
        reasons.append("Surprisingly straightforward language 🤔")
    
    # Detailed analysis
    detailed_analysis = f"""
Technical Analysis:
- Buzzword density: {total_buzzwords/max(total_words, 1):.1%}
- Filler word frequency: {stats['filler_count']/max(total_words, 1):.1%}
- Sentiment score: {sentiment:.2f} (-1 to 1)

Red Flags Found:
{chr(10).join('- ' + flag for flag in stats['red_flags']) if stats['red_flags'] else '- None found'}

Category Breakdown:
{chr(10).join(f'- {k}: {v} buzzwords' for k, v in stats['buzzword_counts'].items() if v > 0)}
    """.strip()

    return {
        'bullshit_percentage': bullshit_score,
        'reasons': reasons,
        'detailed_analysis': detailed_analysis,
        'total_words': total_words,
        'buzzword_count': total_buzzwords,
        'filler_count': stats['filler_count']
    }

@app.route('/')
def hello():
    return jsonify({"message": "Backend is running!"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json() or {}
    text = data.get('text', '')
    return jsonify(analyze_text(text))

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5001, host='0.0.0.0')