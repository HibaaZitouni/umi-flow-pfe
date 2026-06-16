import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const folders = [
  {
    id: 'attestations',
    label: 'Attestations',
    emoji: '📋',
    bg: '#0ea5e9',
    light: '#e0f2fe',
    textColor: '#0c4a6e',
    description: 'Demander et suivre vos attestations de scolarité',
  },
  {
    id: 'emploi',
    label: 'Emploi du temps',
    emoji: '🗓️',
    bg: '#10b981',
    light: '#d1fae5',
    textColor: '#064e3b',
    description: 'Consulter votre planning hebdomadaire',
  },
  {
    id: 'bibliotheque',
    label: 'Bibliothèque',
    emoji: '📚',
    bg: '#8b5cf6',
    light: '#ede9fe',
    textColor: '#4c1d95',
    description: 'Thèses, PFE et ouvrages académiques',
  },
  {
    id: 'evenements',
    label: 'Événements',
    emoji: '🎉',
    bg: '#ef4444',
    light: '#fee2e2',
    textColor: '#7f1d1d',
    description: 'Conférences, séminaires et manifestations',
  },
  {
    id: 'clubs',
    label: 'Clubs',
    emoji: '🎭',
    bg: '#f59e0b',
    light: '#fef3c7',
    textColor: '#78350f',
    description: 'Activités parascolaires et associations',
  },
  {
    id: 'stages',
    label: 'Stages',
    emoji: '💼',
    bg: '#efeb21',
    light: '#fffbeb',
    textColor: '#713f12',
    description: 'Offres de stages et suivi de candidatures',
  },
  {
    id: 'notes',
    label: 'Notes',
    emoji: '🎓',
    bg: '#ec4899',
    light: '#fce7f3',
    textColor: '#831843',
    description: 'Résultats, relevés de notes et moyennes',
  },
];

const CARD_W  = 480;
const CARD_H  = 280;
const OVERLAP = 78;
const TAB_H   = 36;

const StudentFolderStack = () => {
  const navigate   = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    const routes = {
      attestations: '/attestations',
      emploi:       '/student-emploi',
      bibliotheque: '/student-bibliotheque',
      evenements:   '/student-events',
      clubs:        '/student-clubs',
      stages:       '/stages',
      notes:        '/notes',
    };
    if (routes[id]) navigate(routes[id]);
  };

  const totalW = CARD_W + OVERLAP * (folders.length - 1);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: CARD_H + TAB_H + 10,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 50,
    }}>
      <div style={{
        position: 'relative',
        width: totalW,
        height: CARD_H + TAB_H,
        pointerEvents: 'auto',
      }}>
        {folders.map((folder, index) => {
          const isHovered   = hoveredId === folder.id;
          const reversedIdx = folders.length - 1 - index;
          const rightOffset = reversedIdx * OVERLAP;

          const hoveredIndex = hoveredId ? folders.findIndex(f => f.id === hoveredId) : -1;
          const isBehind     = hoveredIndex !== -1 && index > hoveredIndex;

          return (
            <motion.div
              key={folder.id}
              onMouseEnter={() => setHoveredId(folder.id)}
              onMouseLeave={() => setHoveredId(null)}
              onTap={() => handleClick(folder.id)}
              onClick={() => handleClick(folder.id)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: rightOffset,
                width: CARD_W,
                height: CARD_H,
                borderRadius: '14px 14px 0 0',
                background: isHovered
                  ? `linear-gradient(145deg, ${folder.bg}ee, ${folder.bg})`
                  : `linear-gradient(145deg, ${folder.bg}bb, ${folder.bg}dd)`,
                boxShadow: isHovered
                  ? `-8px -6px 36px ${folder.bg}55`
                  : `-4px -4px 16px rgba(0,0,0,0.14)`,
                border: '1px solid rgba(255,255,255,0.22)',
                borderBottom: 'none',
                cursor: 'pointer',
                zIndex: isHovered ? 50 : reversedIdx + 10,
                overflow: 'visible',
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{
                y: isHovered ? -24 : 0,
                x: isHovered ? -10 : 0,
                scale: isHovered ? 1.04 : 1,
                rotate: isHovered ? -1.5 : 0,
                opacity: isBehind ? 0.6 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              {/* tab */}
              <div style={{
                position: 'absolute',
                top: -TAB_H,
                left: 0,
                width: 178,
                height: TAB_H,
                borderRadius: '10px 10px 0 0',
                background: folder.bg,
                border: '1px solid rgba(255,255,255,0.25)',
                borderBottom: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <span style={{ fontSize: 13 }}>{folder.emoji}</span>
                <span style={{
                  fontSize: 10.5, fontWeight: 700,
                  color: 'rgba(255,255,255,0.93)',
                  letterSpacing: '1.6px', textTransform: 'uppercase',
                }}>
                  {folder.label}
                </span>
              </div>

              {/* inner paper sheet */}
              <div style={{
                position: 'absolute',
                top: 8, left: 14, right: 14, bottom: 0,
                background: 'rgba(255,255,255,0.58)',
                borderRadius: '10px 10px 0 0',
                backdropFilter: 'blur(4px)',
              }} />

              {/* content */}
              <div style={{
                position: 'relative', zIndex: 2,
                padding: '22px 26px 20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{folder.emoji}</div>
                  <h2 style={{
                    fontSize: 22, fontWeight: 800,
                    color: folder.textColor,
                    margin: '0 0 6px',
                    letterSpacing: '-0.3px',
                  }}>
                    {folder.label}
                  </h2>
                  <p style={{
                    fontSize: 13, color: folder.textColor + 'bb',
                    margin: 0, lineHeight: 1.5, maxWidth: '72%',
                  }}>
                    {folder.description}
                  </p>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: folder.light,
                  border: `1px solid ${folder.textColor}28`,
                  borderRadius: 20, padding: '6px 14px',
                  alignSelf: 'flex-start',
                }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: folder.textColor }}>
                    Explorer →
                  </span>
                </div>
              </div>

              {/* shine */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '14px 14px 0 0',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)',
                pointerEvents: 'none',
              }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentFolderStack;