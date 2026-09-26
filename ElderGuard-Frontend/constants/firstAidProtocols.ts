/**
 * FIRST AID PROTOCOLS — Frontend local copy
 *
 * This is the last-resort offline fallback.
 * It mirrors the backend's src/data/firstAidProtocols.ts exactly.
 *
 * Used when:
 *  - Network is unavailable
 *  - Backend is down
 *  - Request times out
 *  - Authentication has expired
 *
 * The user should NEVER see "Unable to load first-aid instructions."
 * This file ensures we always have something to show.
 */

export interface FirstAidStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
}

export interface FirstAidProtocol {
  emergencyType: string;
  title: string;
  severity: 'high' | 'critical';
  disclaimer: string;
  steps: FirstAidStep[];
  contextualTip?: string;
  source: 'offline' | 'ai-enhanced';
  lastUpdated: string;
}

const OFFLINE_PROTOCOLS: Record<string, FirstAidProtocol> = {
  fall: {
    emergencyType: 'fall',
    title: 'Fall / Trip',
    severity: 'high',
    disclaimer:
      'For a serious or life-threatening emergency, contact local emergency medical services immediately.',
    steps: [
      {
        id: 1,
        title: 'Stay Calm & Assess the Scene',
        description:
          'Do not rush to move the person. Approach calmly and speak clearly: "Can you hear me? Where does it hurt?" Ensure the surrounding area is safe before getting closer.',
        instruction: 'Observe breathing and posture without lifting or shaking the person.',
      },
      {
        id: 2,
        title: 'Check Responsiveness',
        description:
          'Gently squeeze their hand or touch their shoulder. If unresponsive, confused, or if breathing seems abnormal, call emergency services immediately.',
        instruction: 'Do not shake vigorously. Do not give food or fluids if they appear drowsy.',
      },
      {
        id: 3,
        title: 'Check for Injuries',
        description:
          'Carefully look for signs of injury at common impact points: hips, wrists, knees, and back of the head. Look for swelling, bruising, or unnatural limb positions.',
        instruction: 'Apply gentle, clean pressure if there is surface bleeding. Do not apply pressure to suspected fracture sites.',
      },
      {
        id: 4,
        title: 'Do Not Force Movement',
        description:
          'If the person reports hip pain, severe back pain, or neck tenderness, keep them still and lying flat. Cover them with a blanket for warmth while waiting for paramedics.',
        instruction: 'Moving someone with a possible fracture can worsen internal injury. Only move if there is immediate danger.',
      },
      {
        id: 5,
        title: 'Safe Assisted Rise (Only If Uninjured)',
        description:
          'Only attempt this if the person insists they are uninjured and wishes to get up. Guide them to roll onto hands and knees, crawl toward a sturdy armchair, rest one knee, and rise slowly.',
        instruction: 'Always place a chair or stable surface behind them so they can sit immediately after rising.',
      },
    ],
    source: 'offline',
    lastUpdated: '2026-09-26',
  },

  cardiac: {
    emergencyType: 'cardiac',
    title: 'Cardiac Emergency',
    severity: 'critical',
    disclaimer:
      'A cardiac emergency is life-threatening. Call emergency services immediately before starting first aid.',
    steps: [
      {
        id: 1,
        title: 'Call Emergency Services Immediately',
        description:
          'Do not delay — call emergency services (911, 999, or your local number) the moment cardiac arrest or a heart attack is suspected.',
        instruction: 'Keep the line open. The dispatcher can guide you through CPR if needed.',
      },
      {
        id: 2,
        title: 'Keep the Person Calm & Still',
        description:
          'If conscious, help them sit upright leaning slightly forward. Loosen tight clothing around the neck and chest.',
        instruction: 'Reassure them calmly. Do not let them walk around or exert themselves.',
      },
      {
        id: 3,
        title: 'Begin CPR If Unconscious',
        description:
          'If unresponsive and not breathing normally, place the heel of your hand on the centre of the chest. Push down hard and fast — at least 5 cm deep, 100–120 presses per minute.',
        instruction: 'If trained, give 2 rescue breaths after every 30 compressions. Otherwise, continue chest compressions only.',
      },
      {
        id: 4,
        title: 'Use AED If Available',
        description:
          'Turn on the AED and follow its audio instructions exactly. Continue CPR until the AED is ready to deliver a shock.',
        instruction: 'Remove clothing from the chest area before placing AED pads.',
      },
      {
        id: 5,
        title: 'Continue Until Help Arrives',
        description:
          'Continue CPR and AED cycles without stopping until emergency services take over or the person begins to breathe normally.',
        instruction: 'Take turns with another person to prevent fatigue if possible.',
      },
    ],
    source: 'offline',
    lastUpdated: '2026-09-26',
  },

  stroke: {
    emergencyType: 'stroke',
    title: 'Stroke / Brain Attack',
    severity: 'critical',
    disclaimer:
      'Every minute matters during a stroke. Call emergency services immediately — do not wait to see if symptoms improve.',
    steps: [
      {
        id: 1,
        title: 'Use the FAST Test',
        description:
          'Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. If ANY sign is present, act immediately.',
        instruction: 'Note the exact time symptoms started — this is critical for treatment.',
      },
      {
        id: 2,
        title: 'Call Emergency Services',
        description:
          'Call emergency services immediately. State clearly: "I think this person is having a stroke." Give their age, symptoms, and your exact location.',
        instruction: 'Time of symptom onset is critical for stroke treatment eligibility.',
      },
      {
        id: 3,
        title: 'Keep the Person Comfortable',
        description:
          'Help them lie with head and shoulders slightly raised, tilted toward the weaker side. Loosen tight clothing. Keep them calm.',
        instruction: 'Do not give anything to eat or drink — stroke affects swallowing and can cause choking.',
      },
      {
        id: 4,
        title: 'If Unconscious, Use Recovery Position',
        description:
          'If unconscious but breathing, carefully roll them onto their side so fluids can drain.',
        instruction: 'Support the head and keep the airway open. Check breathing regularly.',
      },
      {
        id: 5,
        title: 'Monitor and Reassure',
        description:
          'Stay with the person. Talk to them gently even if they cannot respond — they may still hear you.',
        instruction: 'Do not leave them alone. If they stop breathing, begin CPR.',
      },
    ],
    source: 'offline',
    lastUpdated: '2026-09-26',
  },

  choking: {
    emergencyType: 'choking',
    title: 'Choking',
    severity: 'critical',
    disclaimer:
      'Choking is a medical emergency. Act immediately. Call emergency services if the person becomes unconscious.',
    steps: [
      {
        id: 1,
        title: 'Encourage Coughing',
        description:
          'If the person is coughing forcefully, encourage them to continue. Do not slap their back while they are coughing effectively.',
        instruction: 'A person who can speak or cough is not fully obstructed.',
      },
      {
        id: 2,
        title: 'Give Back Blows',
        description:
          'If unable to cough, speak, or breathe: lean them forward, support their chest, and give up to 5 firm strikes between the shoulder blades with the heel of your hand.',
        instruction: 'Each blow should be a separate, sharp strike. Check after each blow.',
      },
      {
        id: 3,
        title: 'Give Abdominal Thrusts',
        description:
          'Stand behind the person. Place a fist thumb-side just above the navel and below the breastbone. Grasp it with your other hand and pull sharply inward and upward up to 5 times.',
        instruction: 'For elderly or frail individuals, use firm but controlled force to avoid rib injury.',
      },
      {
        id: 4,
        title: 'Alternate Back Blows and Abdominal Thrusts',
        description:
          'Continue alternating 5 back blows with 5 abdominal thrusts. Call emergency services if not already done.',
        instruction: 'Keep repeating until the object is expelled, the person can breathe, or help arrives.',
      },
      {
        id: 5,
        title: 'If the Person Becomes Unconscious',
        description:
          'Lower them carefully to the floor, call emergency services, and begin CPR. Each time you open the airway, look inside — remove the object only if you can clearly see it.',
        instruction: 'Do not perform blind finger sweeps.',
      },
    ],
    source: 'offline',
    lastUpdated: '2026-09-26',
  },

  breathing: {
    emergencyType: 'breathing',
    title: 'Breathing Difficulty',
    severity: 'high',
    disclaimer:
      "Severe difficulty breathing is a medical emergency. If the person's lips or fingertips turn blue, call emergency services immediately.",
    steps: [
      {
        id: 1,
        title: 'Help the Person Sit Upright',
        description:
          'Sitting upright (leaning slightly forward, hands on knees) opens the airways. Do not make them lie flat unless unconscious.',
        instruction: 'Lying flat compresses the lungs and makes breathing harder.',
      },
      {
        id: 2,
        title: 'Loosen Clothing & Provide Fresh Air',
        description:
          'Loosen tight clothing around the neck, chest, or waist. Open a window or move to open air. A gentle fan often helps.',
        instruction: 'Avoid smoke, dust, or strong scents which can worsen breathing.',
      },
      {
        id: 3,
        title: 'Reassure and Calm the Person',
        description:
          'Anxiety worsens breathing difficulty. Speak calmly. Guide them to breathe in through the nose for 4 counts, then out through pursed lips for 6 counts.',
        instruction: 'Panic breathing depletes oxygen faster. Calm, steady breathing conserves it.',
      },
      {
        id: 4,
        title: 'Assist with Prescribed Medication',
        description:
          'If the person has a prescribed inhaler or oxygen equipment, help them use it as prescribed. Do not administer medications not prescribed to them.',
        instruction: 'Most rescue inhalers: 1–2 puffs every 20 minutes for up to 3 doses while awaiting help.',
      },
      {
        id: 5,
        title: 'Call Emergency Services If Not Improving',
        description:
          'Call immediately if: breathing does not improve, the person cannot speak in full sentences, lips or fingertips turn blue/grey, or they lose consciousness.',
        instruction: 'Do not leave the person alone. Begin CPR if they stop breathing.',
      },
    ],
    source: 'offline',
    lastUpdated: '2026-09-26',
  },
};

export function getOfflineProtocol(type: string): FirstAidProtocol | null {
  const key = (type || '').toLowerCase().trim();
  return OFFLINE_PROTOCOLS[key] ?? null;
}

export const SUPPORTED_EMERGENCY_TYPES = Object.keys(OFFLINE_PROTOCOLS);

export default OFFLINE_PROTOCOLS;
