import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// Pre-made flashcard deck from Article 28 Inspection Q&A - Hudson Yards
const FLASHCARD_DECK = [
  {
    front: "Can you describe the patient identification process?",
    back: "We use **2 patient identifiers**, which includes **full name** and **DOB** when calling patients in the waiting room, administering medication/collecting specimens.<br><br>**FOR TECHS**: we use **2 patient identifiers** and confirm the order/scan that is being done"
  },
  {
    front: "Can you identify a performance improvement (PI) project/activity?",
    back: "**Radiology conducts chart reviews** as a PI project/activity"
  },
  {
    front: "What do you do in the event of a fire?",
    back: "**R**escue, **A**larm, **C**onfine, **E**xtinguish/Evacuate<br><br><span class=\"protocol-label\">RACE Protocol</span>"
  },
  {
    front: "Where is the nearest fire exit/pulldown and fire extinguisher?",
    back: "**Fire exit/pulldown**: Stairway D (Exit near CT; leads to Tishman Lobby and then outside) and Stairway B (Exit near CT, through double doors, leads outside)<br><br>**Fire extinguishers**: Inside Zone 3 of MRI"
  },
  {
    front: "How do you use a fire extinguisher?",
    back: "**P**ull pin, **A**im Nozzle, **S**queeze handle and **S**weep side to side<br><br><span class=\"protocol-label\">PASS Method</span>"
  },
  {
    front: "How do you request interpreter services?",
    back: "We have the **iPad on site** for both audio and video interpretation; we call the number, give the access code, take down the information of the agent and **document it in the medical record**.<br><br>iPad is located in the **nurse prep room**"
  },
  {
    front: "Can you locate the Safety Data Sheets and can you show me?",
    back: "Safety Data Sheets are located on the **NYP Intranet > Search bar > Safety Data Sheets > MSDS**"
  },
  {
    front: "What is the wet/contact time for disinfectant wipes?",
    back: "• **Purple Top** (Alcohol Wipes): **2 minutes** (read off label)<br>• **Red Top** (Ultrasound Wipes): **3 minutes** (read off label)<br>• **Orange Top** (Bleach Wipes): **4 minutes** (read off label)"
  },
  {
    front: "What do you do in the event of an active shooter?",
    back: "**A**void, **B**arricade, **C**onfront<br><br><span class=\"protocol-label\">ABC Protocol</span>"
  },
  {
    front: "What do you do when confronted with a challenging patient that exhibits aggressive behavior?",
    back: "Per the **de-escalation training**, we place them in a separate room/area, attempt to de-escalate further, and contact **management/security** as needed"
  },
  {
    front: "Describe the use of Medical Chaperone prior to the commencement of any exam/treatment/procedure?",
    back: "• **PRESENCE REQUIRED**: Pelvic, vaginal and intravaginal exams/procedures<br>• **OFFERING REQUIRED**: Rectal, external genitalia, breast exams/procedures<br>• If chaperone is **REQUESTED** by patient or staff for any reason, chaperone **must be given**<br>• If chaperone is **not available**, appointment must be **rescheduled** when chaperone is available in office<br>• **Minors and adults without capacity** cannot decline a medical chaperone for any of the exams or procedures listed above"
  },
  {
    front: "What do you do in the event of an allegation of sexual misconduct?",
    back: "**Ensure that patient is safe**, contact management, enter in **SafetyZone**"
  },
  {
    front: "What are the methods by which staff can be alerted to an emergency?",
    back: "**Manager/Supervisor** and **overhead announcements**"
  },
  {
    front: "Do you know where to find the departments policies and procedures?",
    back: "**WCINY** policies and procedures are located on the **Share Point** (Radiology Intranet)"
  },
  {
    front: "What is AED?",
    back: "An **Automated External Defibrillator (AED)** is a medical device designed to **analyze the heart rhythm** and deliver an **electric shock** to victims of ventricular fibrillation to **restore the heart rhythm to normal**"
  },
  {
    front: "Where is AED Located?",
    back: "**1 outside of MRI**, near reading rooms and **1 in CT control room**"
  },
  {
    front: "What do you do after a patient leaves the exam room?",
    back: "Review process of **cleaning the room**, **equipment** and **hand hygiene**"
  },
  {
    front: "Important Notes - What should you always remember?",
    back: "1. Be sure you have **access to the Radiology Intranet** to find **WCINY** policies & procedures<br>2. Have your **ID visible at eye level**<br>3. **No personal food/drinks** in patient care areas<br>4. Review how to use **emergency locks** (aka \"suicide locks\")<br>5. If you don't know the answer to a question, you can **ask a colleague or manager**. The surveyors want to see that you know how to find the answer"
  }
];

// Enhanced markdown to HTML converter for flashcard formatting
const formatText = (text) => {
  if (!text) return '';
  
  // First handle special acronym patterns with vertical formatting
  let formatted = text;
  
  // Handle RACE acronym
  formatted = formatted.replace(/\*\*R\*\*escue, \*\*A\*\*larm, \*\*C\*\*onfine, \*\*E\*\*xtinguish\/Evacuate/g, 
    '<div class="acronym-block"><div class="acronym-letter">R</div><div class="acronym-word">escue</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">A</div><div class="acronym-word">larm</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">C</div><div class="acronym-word">onfine</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">E</div><div class="acronym-word">xtinguish/Evacuate</div></div>');
  
  // Handle PASS acronym
  formatted = formatted.replace(/\*\*P\*\*ull pin, \*\*A\*\*im Nozzle, \*\*S\*\*queeze handle and \*\*S\*\*weep side to side/g,
    '<div class="acronym-block"><div class="acronym-letter">P</div><div class="acronym-word">ull pin</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">A</div><div class="acronym-word">im Nozzle</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">S</div><div class="acronym-word">queeze handle</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">S</div><div class="acronym-word">weep side to side</div></div>');
  
  // Handle ABC acronym
  formatted = formatted.replace(/\*\*A\*\*void, \*\*B\*\*arricade, \*\*C\*\*onfront/g,
    '<div class="acronym-block"><div class="acronym-letter">A</div><div class="acronym-word">void</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">B</div><div class="acronym-word">arricade</div></div>' +
    '<div class="acronym-block"><div class="acronym-letter">C</div><div class="acronym-word">onfront</div></div>');
  
  // Convert remaining **bold** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert newlines to <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Convert bullet points (lines starting with •)
  formatted = formatted.replace(/^• (.+)$/gm, '<div class="bullet-point">• $1</div>');
  
  return formatted;
};

const FlashcardApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [studiedCards, setStudiedCards] = useState(new Set());

  const currentCard = FLASHCARD_DECK[currentIndex];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) {
      setStudiedCards(prev => new Set([...prev, currentIndex]));
    }
  };

  const handleNext = () => {
    if (currentIndex < FLASHCARD_DECK.length - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setStudiedCards(new Set());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleFlip();
    }
    if (e.key === 'r' || e.key === 'R') handleReset();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, flipped, animating]);

  // Add CSS for 3D flip animation and medical formatting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .rotate-x-180 {
        transform: rotateX(180deg);
      }
      .backface-hidden {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      .transform-style-preserve-3d {
        transform-style: preserve-3d;
      }
      
      /* Enhanced formatting for medical compliance with larger, bolder text */
      strong {
        color: #1f2937;
        font-weight: 800;
        font-size: 1.15em;
        background: linear-gradient(135deg, #DC2626, #EA580C, #F97316);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* Vertical acronym styling */
      .acronym-block {
        display: flex;
        align-items: center;
        margin: 0.75rem 0;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(234, 88, 12, 0.1));
        border-left: 4px solid #DC2626;
        border-radius: 0.5rem;
      }
      
      .acronym-letter {
        font-size: 2.5rem;
        font-weight: 900;
        color: #DC2626;
        margin-right: 1rem;
        min-width: 3rem;
        text-align: center;
        background: linear-gradient(135deg, #DC2626, #EA580C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
      }
      
      .acronym-word {
        font-size: 1.5rem;
        font-weight: 600;
        color: #374151;
        flex: 1;
      }
      
      .bullet-point {
        margin: 1rem 0;
        padding: 0.75rem 1.25rem;
        font-size: 1.1rem;
        font-weight: 600;
        background: rgba(249, 250, 251, 0.8);
        border-radius: 0.5rem;
        border-left: 3px solid #DC2626;
      }
      
      /* Enhanced card styling */
      .flashcard-shadow {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 
                    0 0 0 1px rgba(220, 38, 38, 0.1);
      }
      
      /* Weill Cornell themed hover effects */
      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
      }
      
      /* Make all text more prominent for flashcard use */
      h2 {
        line-height: 1.3 !important;
      }
      
      /* Protocol labels styling */
      .protocol-label {
        display: inline-block;
        background: linear-gradient(135deg, #DC2626, #EA580C);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-weight: 700;
        font-size: 0.9rem;
        margin: 0.5rem 0;
      }
      
      /* Smooth transitions */
      * {
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #EA580C 100%)'
    }}>
      <div className="w-full max-w-4xl px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">Article 28 Compliance</h1>
          <p className="text-red-100 text-lg">Weill Cornell Imaging - Hudson Yards</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Progress</span>
            <span>{studiedCards.size} / {FLASHCARD_DECK.length} studied</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(studiedCards.size / FLASHCARD_DECK.length) * 100}%`,
                background: 'linear-gradient(90deg, #FED7AA 0%, #FDBA74 50%, #FB923C 100%)'
              }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <div
            className={`relative w-full h-96 transition-all duration-700 transform-style-preserve-3d cursor-pointer ${
              flipped ? 'rotate-x-180' : ''
            } ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl flashcard-shadow flex flex-col items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center flex-1 flex items-center justify-center">
                <h2 
                  className="text-3xl font-bold text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(currentCard.front) }}
                />
              </div>
              <p className="text-gray-500 mt-auto text-lg">Use ↑↓ arrows or click to flip</p>
            </div>
            
            {/* Back of card */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl flashcard-shadow flex items-center justify-center p-8 rotate-x-180 backface-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)'
              }}
            >
              <div className="text-left max-h-full overflow-y-auto w-full">
                <div 
                  className="text-xl text-gray-800 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: formatText(currentCard.back) }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-8 space-x-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full transition-all ${
              currentIndex === 0 
                ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                : 'bg-white/20 text-white hover:bg-orange-200/30 hover:text-orange-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <span className="text-white text-xl font-medium">
              {currentIndex + 1} / {FLASHCARD_DECK.length}
            </span>
            <div className="text-red-100 text-sm mt-1">
              {studiedCards.has(currentIndex) ? '✓ Studied' : 'Not studied'}
            </div>
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === FLASHCARD_DECK.length - 1}
            className={`p-3 rounded-full transition-all ${
              currentIndex === FLASHCARD_DECK.length - 1 
                ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                : 'bg-white/20 text-white hover:bg-orange-200/30 hover:text-orange-100'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Reset Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 text-red-200 hover:text-white transition-colors mx-auto"
          >
            <RotateCcw size={16} />
            <span>Reset Progress (R)</span>
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-center mt-8 text-red-200 text-sm">
          <p>Keyboard: ← → (navigate) • ↑↓ (flip) • R (reset)</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;