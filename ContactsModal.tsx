import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { soundEffects, audioManager } from '../utils/audioManager';
import { audioEngine } from '../utils/webAudioEngine';
import GlitchText from './GlitchText';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDialogueTrigger: () => void;
}

export default function ContactsModal({ isOpen, onClose, onDialogueTrigger }: ContactsModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailFormData, setEmailFormData] = useState({ name: '', email: '', message: '' });
  const dialogueTriggeredRef = useRef(false);

  const handleClose = async () => {
    await audioEngine.resume();
    await audioManager.resume();
    soundEffects.play('button');
    onClose();
  };

  const handleEmailClick = async () => {
    await audioEngine.resume();
    await audioManager.resume();
    soundEffects.play('button');
    setShowEmailForm(true);
  };

  const handleSendEmail = async () => {
    await audioEngine.resume();
    await audioManager.resume();
    soundEffects.play('button');
    const mailtoLink = `mailto:makbondal@mail.ru?subject=Сообщение от ${emailFormData.name || 'Гостя'}&body=${encodeURIComponent(emailFormData.message)}${emailFormData.email ? `%0D%0A%0D%0AОтветить на: ${emailFormData.email}` : ''}`;
    window.location.href = mailtoLink;
    setShowEmailForm(false);
    setEmailFormData({ name: '', email: '', message: '' });
  };

  useEffect(() => {
    if (isOpen && !dialogueTriggeredRef.current) {
      dialogueTriggeredRef.current = true;
      const timer = setTimeout(() => {
        onDialogueTrigger();
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (!isOpen) {
      dialogueTriggeredRef.current = false;
    }
  }, [isOpen, onDialogueTrigger]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showEmailForm) {
          setShowEmailForm(false);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, showEmailForm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 arcade-grid-background"
          style={{
            backdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="border-4 border-pink-500 relative overflow-hidden pixel-corners"
            style={{
              width: '900px',
              maxWidth: '90vw',
              height: '600px',
              maxHeight: '85vh',
              background: 'linear-gradient(180deg, #05000a 0%, #1a0033 100%)',
              boxShadow: '0 0 40px rgba(255, 20, 147, 0.8), inset 0 0 60px rgba(255, 20, 147, 0.15)',
              imageRendering: 'pixelated'
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 2px)',
                mixBlendMode: 'overlay'
              }}
            />

            <div
              className="border-b-2 border-pink-500 px-6 py-4 flex justify-between items-center relative z-20"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              <div className="flex items-center gap-8">
                <h2
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '2rem',
                    color: '#ff1493',
                    textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'none'
                  }}
                >
                  КОНТАКТЫ.app
                </h2>
                <div className="flex items-center gap-8">
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      color: '#ff1493',
                      textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                      letterSpacing: '0.05em',
                      fontWeight: 'bold'
                    }}
                  >
                    STATUS: ONLINE
                  </div>
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      color: '#ff1493',
                      textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                      letterSpacing: '0.05em',
                      fontWeight: 'bold'
                    }}
                  >
                    MODE: <GlitchText color="#ff1493" fontSize="0.9rem" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center border-2 border-pink-500 hover:bg-pink-950 transition-all duration-300"
                style={{
                  color: '#ff1493',
                  textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                  imageRendering: 'pixelated'
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative h-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  imageRendering: 'pixelated',
                  opacity: 0.7
                }}
              >
                <source src="https://res.cloudinary.com/djihbhmzz/video/upload/v1771669178/%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D1%8B_%D1%84%D0%BE%D0%BD_nsdhtp.mp4" type="video/mp4" />
              </video>

              <div className="absolute inset-0 flex items-center justify-center gap-12 px-20">
                <a
                  href="https://t.me/BuddyNextDoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    await audioEngine.resume();
                    await audioManager.resume();
                    soundEffects.play('button');
                  }}
                  className="relative cursor-pointer group"
                  style={{
                    filter: 'brightness(0.7)',
                    transition: 'filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.3) drop-shadow(0 0 30px #00FFFF)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(0.7)';
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771669173/Contacts_tg_fstbgk.png"
                    alt="Telegram"
                    style={{
                      imageRendering: 'pixelated',
                      width: '200px',
                      height: 'auto'
                    }}
                  />
                </a>

                <div
                  onClick={handleEmailClick}
                  className="relative cursor-pointer group"
                  style={{
                    filter: 'brightness(0.7)',
                    transition: 'filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.3) drop-shadow(0 0 30px #00FF00)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(0.7)';
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771669173/Contacts_mail_jc6wor.png"
                    alt="E-mail"
                    style={{
                      imageRendering: 'pixelated',
                      width: '200px',
                      height: 'auto'
                    }}
                  />
                </div>

                <a
                  href="https://discord.com/users/1049011262450839614"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    await audioEngine.resume();
                    await audioManager.resume();
                    soundEffects.play('button');
                  }}
                  className="relative cursor-pointer group"
                  style={{
                    filter: 'brightness(0.7)',
                    transition: 'filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.3) drop-shadow(0 0 30px #8B00FF)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(0.7)';
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771669176/Contacts_discord_qsq2vm.png"
                    alt="Discord"
                    style={{
                      imageRendering: 'pixelated',
                      width: '200px',
                      height: 'auto'
                    }}
                  />
                </a>
              </div>

              <div
                className="absolute right-0 top-0 border-4 border-cyan-400 bg-black bg-opacity-70 px-6 py-4"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
                  imageRendering: 'pixelated'
                }}
              >
                <div
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.7rem',
                    lineHeight: '1.8',
                    color: '#ffffff',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Бондаренко Максим
                  <br />
                  tg: @BuddyNextDoor
                  <br />
                  +7 (985) 122-19-35
                  <br />
                  makbondal@mail.ru
                </div>
              </div>
            </div>
          </motion.div>

          {showEmailForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center p-4 z-[60]"
              onClick={() => setShowEmailForm(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="border-4 border-cyan-400 bg-black bg-opacity-95 p-8 pixel-corners"
                style={{
                  width: '500px',
                  maxWidth: '90vw',
                  boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
                  imageRendering: 'pixelated'
                }}
              >
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '1.2rem',
                    color: '#00ffff',
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                    textAlign: 'center'
                  }}
                >
                  НАПИСАТЬ НА E-MAIL
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.6rem',
                        color: '#00ffff',
                        display: 'block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      ИМЯ
                    </label>
                    <input
                      type="text"
                      value={emailFormData.name}
                      onChange={(e) => setEmailFormData({ ...emailFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-cyan-400 bg-black text-white"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.6rem',
                        color: '#00ffff',
                        display: 'block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      ВАШ E-MAIL (необязательно)
                    </label>
                    <input
                      type="email"
                      value={emailFormData.email}
                      onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-cyan-400 bg-black text-white"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.6rem',
                        color: '#00ffff',
                        display: 'block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      СООБЩЕНИЕ
                    </label>
                    <textarea
                      value={emailFormData.message}
                      onChange={(e) => setEmailFormData({ ...emailFormData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2 border-2 border-cyan-400 bg-black text-white resize-none"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSendEmail}
                      className="flex-1 px-6 py-3 border-2 border-green-400 bg-green-950 hover:bg-green-900 transition-all"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        color: '#00ff00',
                        textShadow: '0 0 10px rgba(0, 255, 0, 0.8)'
                      }}
                    >
                      ОТПРАВИТЬ
                    </button>
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-pink-400 bg-pink-950 hover:bg-pink-900 transition-all"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        color: '#ff1493',
                        textShadow: '0 0 10px rgba(255, 20, 147, 0.8)'
                      }}
                    >
                      ОТМЕНА
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
