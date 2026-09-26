/**
 * FIRST AID PROTOCOLS — Static, medically-reviewed emergency protocols
 *
 * These are the source of truth for all first-aid instructions in ElderGuard.
 * AI assistance is an optional enhancement only — it never replaces these steps.
 *
 * Protocols cover the five most common elder emergencies:
 *   fall | cardiac | stroke | choking | breathing
 *
 * Last reviewed: 2026-09-26
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
  lastUpdated: string;
}

const PROTOCOLS: Record<string, FirstAidProtocol> = {
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
          'Only attempt this if the person insists they are uninjured and wishes to get up. Guide them to roll onto their hands and knees first, then crawl toward a sturdy armchair, rest one knee on the floor, and rise slowly.',
        instruction: 'Always place a chair or stable surface behind them so they can sit immediately after rising.',
      },
    ],
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
          'Do not delay — call emergency services (911, 999, or your local number) the moment cardiac arrest or a heart attack is suspected. Tell them the person\'s age and symptoms.',
        instruction: 'Keep the line open. The dispatcher can guide you through CPR if needed.',
      },
      {
        id: 2,
        title: 'Keep the Person Calm & Still',
        description:
          'If the person is conscious and complaining of chest pain, help them sit or lie in the most comfortable position — usually sitting upright, leaning slightly forward. Loosen tight clothing around the neck and chest.',
        instruction: 'Reassure them calmly. Do not let them walk around or exert themselves.',
      },
      {
        id: 3,
        title: 'Check Breathing & Pulse',
        description:
          'If the person becomes unresponsive and is not breathing normally (no rise of chest, gasping, or silent), begin CPR. Place the heel of your hand on the centre of the chest. Push down hard and fast — at least 5 cm deep, at a rate of 100–120 presses per minute.',
        instruction: 'If trained, give 2 rescue breaths after every 30 compressions. If not trained, continue chest compressions only.',
      },
      {
        id: 4,
        title: 'Use AED If Available',
        description:
          'If an Automated External Defibrillator (AED) is available, turn it on and follow its audio instructions exactly. Continue CPR until the AED is ready.',
        instruction: 'Do not use an AED if the person is in water. Remove clothing from the chest area before placing pads.',
      },
      {
        id: 5,
        title: 'Continue Until Help Arrives',
        description:
          'Continue CPR and AED cycles without stopping until emergency services take over, or the person begins to breathe normally. Do not stop to check for a pulse during compressions.',
        instruction: 'Take turns with another person to prevent fatigue if possible.',
      },
    ],
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
          'Check for the four warning signs: **F**ace drooping (one side of the face droops or is numb), **A**rm weakness (one arm drifts downward when both are raised), **S**peech difficulty (slurred, strange, or unable to speak), **T**ime to call emergency services immediately.',
        instruction: 'If ANY one of these signs is present, call emergency services right away.',
      },
      {
        id: 2,
        title: 'Call Emergency Services',
        description:
          'Call emergency services immediately. State clearly: "I think this person is having a stroke." Give the person\'s age, symptoms, and your exact location. Note the time symptoms started — doctors need this information for treatment decisions.',
        instruction: 'Time of symptom onset is critical for stroke treatment eligibility.',
      },
      {
        id: 3,
        title: 'Keep the Person Comfortable',
        description:
          'Help the person lie down with their head and shoulders slightly raised and tilted toward the weaker side. Loosen any tight clothing. Keep them calm and reassured.',
        instruction: 'Do not give anything to eat or drink — stroke affects swallowing and this can cause choking.',
      },
      {
        id: 4,
        title: 'If Unconscious, Use Recovery Position',
        description:
          'If the person is unconscious but breathing, carefully roll them onto their side (recovery position) with their mouth facing downward so fluids can drain.',
        instruction: 'Support the head and keep the airway open. Check breathing regularly until help arrives.',
      },
      {
        id: 5,
        title: 'Monitor and Reassure',
        description:
          'Stay with the person. Monitor their breathing and level of consciousness. Talk to them gently even if they cannot respond — they may still be able to hear you.',
        instruction: 'Do not leave the person alone. If they stop breathing, be ready to begin CPR.',
      },
    ],
    lastUpdated: '2026-09-26',
  },

  choking: {
    emergencyType: 'choking',
    title: 'Choking',
    severity: 'critical',
    disclaimer:
      'Choking is a medical emergency. Act immediately. Call emergency services if the person becomes unconscious or the obstruction is not cleared.',
    steps: [
      {
        id: 1,
        title: 'Encourage Coughing',
        description:
          'If the person is coughing forcefully, encourage them to continue. Do not slap their back while they are coughing effectively — this can make the obstruction worse.',
        instruction: 'Ask clearly: "Are you choking? Can you cough?" A person who can speak or cough is not fully obstructed.',
      },
      {
        id: 2,
        title: 'Give Back Blows',
        description:
          'If the person cannot cough, speak, or breathe, give up to 5 firm back blows. Lean them forward, support their chest with one hand, and strike firmly between the shoulder blades with the heel of your other hand.',
        instruction: 'Each blow should be a separate, sharp strike. Check after each blow to see if the obstruction has cleared.',
      },
      {
        id: 3,
        title: 'Give Abdominal Thrusts (Heimlich Manoeuvre)',
        description:
          'Stand behind the person. Place one foot forward for stability. Make a fist with one hand, place it thumb-side against the centre of the abdomen — just above the navel and below the breastbone. Grasp your fist with the other hand and pull sharply inward and upward up to 5 times.',
        instruction: 'For elderly or frail individuals, use firm but controlled force to avoid rib injury.',
      },
      {
        id: 4,
        title: 'Alternate Back Blows and Abdominal Thrusts',
        description:
          'If the obstruction is still not cleared, continue alternating 5 back blows with 5 abdominal thrusts. Call emergency services if you have not already done so.',
        instruction: 'Keep repeating until the object is expelled, the person can breathe, or emergency services arrive.',
      },
      {
        id: 5,
        title: 'If the Person Becomes Unconscious',
        description:
          'Lower the person carefully to the floor. Call emergency services immediately. Begin CPR. Each time you open the airway to give rescue breaths, look inside the mouth — if you see the object, remove it with a finger sweep.',
        instruction: 'Do not perform blind finger sweeps — only remove an object if you can clearly see it.',
      },
    ],
    lastUpdated: '2026-09-26',
  },

  breathing: {
    emergencyType: 'breathing',
    title: 'Breathing Difficulty',
    severity: 'high',
    disclaimer:
      'Severe difficulty breathing is a medical emergency. If the person\'s lips or fingertips turn blue, call emergency services immediately.',
    steps: [
      {
        id: 1,
        title: 'Help the Person Sit Upright',
        description:
          'Sitting upright (leaning slightly forward, hands on knees) opens the airways and reduces the effort of breathing. Do not make them lie flat unless they lose consciousness.',
        instruction: 'Avoid laying them flat — this compresses the lungs and makes breathing harder.',
      },
      {
        id: 2,
        title: 'Loosen Clothing & Provide Fresh Air',
        description:
          'Loosen any tight clothing around the neck, chest, or waist. Open a window or move to an open area if possible. Turn on a fan if available — gentle airflow often helps.',
        instruction: 'Avoid smoke, dust, or strong scents in the area which can worsen breathing.',
      },
      {
        id: 3,
        title: 'Reassure and Calm the Person',
        description:
          'Anxiety makes breathing difficulty worse. Speak calmly and slowly. Guide them to breathe in through the nose for 4 counts, then out through pursed lips for 6 counts. Stay with them.',
        instruction: 'Panic breathing (short, fast gasps) depletes oxygen faster. Calm, steady breathing conserves it.',
      },
      {
        id: 4,
        title: 'Assist with Prescribed Medication',
        description:
          'If the person has a prescribed inhaler (for asthma or COPD) or oxygen equipment, help them use it according to their prescription. Do not administer medications that have not been prescribed to them.',
        instruction: 'Most rescue inhalers should be given 1–2 puffs every 20 minutes for up to 3 doses while awaiting help.',
      },
      {
        id: 5,
        title: 'Call Emergency Services If Not Improving',
        description:
          'Call emergency services immediately if: breathing does not improve within a few minutes, the person is struggling to speak in full sentences, their lips or fingertips turn blue or grey, or they lose consciousness.',
        instruction: 'Do not leave the person alone. If they stop breathing, begin CPR and maintain it until help arrives.',
      },
    ],
    lastUpdated: '2026-09-26',
  },
};

export function getProtocol(type: string): FirstAidProtocol | null {
  const key = type.toLowerCase().trim();
  return PROTOCOLS[key] ?? null;
}

export function getAllProtocolTypes(): string[] {
  return Object.keys(PROTOCOLS);
}

export default PROTOCOLS;
