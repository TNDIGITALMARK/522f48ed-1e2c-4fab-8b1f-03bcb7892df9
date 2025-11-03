import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { cyclePhase, symptoms, mood, cycleDay, previousSymptoms } = await request.json();

    // Validate required fields
    if (!cyclePhase) {
      return NextResponse.json(
        { error: 'Missing required field: cyclePhase' },
        { status: 400 }
      );
    }

    // Generate AI insights using Anthropic Claude
    const insights = await generateCycleInsights({
      cyclePhase,
      symptoms: symptoms || [],
      mood,
      cycleDay,
      previousSymptoms: previousSymptoms || []
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating cycle insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

interface InsightsRequest {
  cyclePhase: 'Menstruation' | 'Follicular' | 'Ovulation' | 'Luteal';
  symptoms: string[];
  mood?: { rating: number; label: string };
  cycleDay?: number;
  previousSymptoms?: string[];
}

async function generateCycleInsights(data: InsightsRequest) {
  const { cyclePhase, symptoms, mood, cycleDay, previousSymptoms } = data;

  // Build context for AI
  const symptomText = symptoms.length > 0 ? symptoms.join(', ') : 'none reported';
  const moodText = mood ? `${mood.label} (${mood.rating}/10)` : 'not recorded';
  const dayText = cycleDay ? `day ${cycleDay}` : '';
  const previousSymptomsText = previousSymptoms && previousSymptoms.length > 0
    ? previousSymptoms.join(', ')
    : 'none';

  const prompt = `You are a compassionate women's health and wellness expert providing personalized cycle insights.

Current Cycle Information:
- Phase: ${cyclePhase} ${dayText}
- Current Symptoms: ${symptomText}
- Mood: ${moodText}
- Previous Symptoms: ${previousSymptomsText}

Provide personalized, actionable insights for this ${cyclePhase} phase. Include:

1. **Phase Analysis**: Brief explanation of what's happening in their body during this phase
2. **Symptom Insights**: If symptoms are present, explain why they might be experiencing them and if they're typical for this phase
3. **Personalized Recommendations**:
   - Specific nutrition advice (what foods to focus on and why)
   - Workout recommendations (intensity level, specific exercise types)
   - Self-care practices (what will help them feel their best)
4. **Wellness Tips**: 2-3 actionable tips they can implement today
5. **Affirmation**: An empowering, supportive affirmation for this phase

Keep the tone warm, supportive, and empowering. Focus on helping them work WITH their body, not against it. Be specific and actionable. Format the response as JSON with this structure:

{
  "phaseAnalysis": "Brief explanation of the phase",
  "symptomInsights": "Insights about their specific symptoms",
  "recommendations": {
    "nutrition": ["Specific food 1", "Specific food 2", "Specific food 3"],
    "workout": ["Specific workout type", "Intensity guidance", "Movement suggestion"],
    "selfCare": ["Self-care practice 1", "Self-care practice 2"]
  },
  "wellnessTips": ["Tip 1", "Tip 2", "Tip 3"],
  "affirmation": "Empowering affirmation"
}`;

  try {
    if (!ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not configured, using fallback insights');
      return getFallbackInsights(cyclePhase, symptoms);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, await response.text());
      return getFallbackInsights(cyclePhase, symptoms);
    }

    const aiResponse = await response.json();
    const content = aiResponse.content[0].text;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      return insights;
    }

    return getFallbackInsights(cyclePhase, symptoms);
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return getFallbackInsights(cyclePhase, symptoms);
  }
}

function getFallbackInsights(
  cyclePhase: string,
  symptoms: string[]
): any {
  const fallbacks: Record<string, any> = {
    'Menstruation': {
      phaseAnalysis: 'During menstruation, your body is shedding the uterine lining. Hormone levels (estrogen and progesterone) are at their lowest, which can lead to fatigue and the need for rest.',
      symptomInsights: symptoms.length > 0
        ? `You're experiencing ${symptoms.join(', ')}. These are common during menstruation as your body works hard to shed the uterine lining.`
        : 'Your body is in its renewal phase. Rest and gentle movement are your allies.',
      recommendations: {
        nutrition: [
          'Iron-rich foods (leafy greens, red meat, lentils) to replenish what\'s lost',
          'Warm, nourishing soups and stews for comfort',
          'Ginger tea to ease cramping and inflammation'
        ],
        workout: [
          'Restorative yoga and gentle stretching',
          'Light walking or swimming',
          'Avoid high-intensity workouts - your body needs rest'
        ],
        selfCare: [
          'Use a heating pad for cramp relief',
          'Take warm baths with Epsom salts',
          'Prioritize 8-9 hours of sleep'
        ]
      },
      wellnessTips: [
        'Listen to your body and rest when you need to',
        'Stay hydrated to help with bloating',
        'Practice gentle movement to boost endorphins'
      ],
      affirmation: 'It\'s okay to rest — your body is working hard for you. Honor this time of renewal.'
    },
    'Follicular': {
      phaseAnalysis: 'During the follicular phase, estrogen rises as your body prepares to release an egg. You\'ll likely feel an increase in energy, creativity, and motivation.',
      symptomInsights: symptoms.length > 0
        ? `With ${symptoms.join(', ')}, your body is transitioning from rest to activity. This is normal as hormone levels shift.`
        : 'Your energy is rising! This is a great time to tackle challenging goals and try new things.',
      recommendations: {
        nutrition: [
          'Complex carbohydrates (quinoa, oats, sweet potatoes) to fuel rising energy',
          'Lean proteins to support muscle building',
          'Fresh fruits and vegetables for vitamins and minerals'
        ],
        workout: [
          'Strength training with heavier weights',
          'HIIT workouts to match your elevated energy',
          'Try a new fitness class or challenge'
        ],
        selfCare: [
          'Set ambitious goals while motivation is high',
          'Social activities - you\'ll feel more extroverted',
          'Start new projects or creative endeavors'
        ]
      },
      wellnessTips: [
        'Capitalize on your increased energy and focus',
        'This is your power phase for productivity',
        'Challenge yourself physically and mentally'
      ],
      affirmation: 'Strength training and higher carb meals will fuel your energy best. You\'re ready to conquer your goals!'
    },
    'Ovulation': {
      phaseAnalysis: 'Ovulation is when you release an egg - this is your peak energy and confidence phase. Estrogen and testosterone levels are at their highest, making you feel unstoppable.',
      symptomInsights: symptoms.length > 0
        ? `Even with ${symptoms.join(', ')}, you\'re at your physical and mental peak. Work with your body\'s natural rhythm.`
        : 'You\'re at your absolute peak! This is when you can push hardest and accomplish the most.',
      recommendations: {
        nutrition: [
          'Balanced meals with equal parts protein, carbs, and healthy fats',
          'Colorful vegetables for antioxidants',
          'Stay well-hydrated for optimal performance'
        ],
        workout: [
          'Peak intensity workouts - go hard!',
          'Try your heaviest lifts or fastest runs',
          'Group fitness classes for social energy boost'
        ],
        selfCare: [
          'Schedule important meetings or presentations',
          'Have challenging conversations',
          'Embrace social activities and connections'
        ]
      },
      wellnessTips: [
        'This is your time to shine - take on your biggest challenges',
        'Your communication skills are peak - use them!',
        'Confidence is high - step out of your comfort zone'
      ],
      affirmation: 'You\'re at your peak - tackle those challenging goals! Your body and mind are perfectly aligned.'
    },
    'Luteal': {
      phaseAnalysis: 'The luteal phase is when progesterone rises to prepare for potential pregnancy. Energy naturally decreases, and you may feel more introspective and need extra rest.',
      symptomInsights: symptoms.length > 0
        ? `Experiencing ${symptoms.join(', ')} is common as progesterone rises and your body shifts toward rest mode.`
        : 'Your body is naturally winding down. This is a time to be gentle with yourself and honor your need for slower movement.',
      recommendations: {
        nutrition: [
          'Magnesium-rich foods (dark chocolate, avocado, nuts) to ease PMS symptoms',
          'Sweet potatoes and complex carbs for stable blood sugar',
          'Anti-inflammatory foods to reduce bloating'
        ],
        workout: [
          'Low-impact movement like walking or Pilates',
          'Yoga with focus on mobility and flexibility',
          'Lighter weights with higher reps'
        ],
        selfCare: [
          'Extra sleep (aim for 9 hours)',
          'Journaling and reflection time',
          'Cozy evenings at home with self-care rituals'
        ]
      },
      wellnessTips: [
        'Reduce your schedule and say no to extra commitments',
        'This is your nesting phase - create a cozy environment',
        'Be extra kind to yourself as hormones shift'
      ],
      affirmation: 'Your body needs gentleness right now - honor that. Slowing down is not weakness, it\'s wisdom.'
    }
  };

  return fallbacks[cyclePhase] || fallbacks['Menstruation'];
}
