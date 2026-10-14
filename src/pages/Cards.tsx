import React, { useState } from 'react'
import { CardItem } from '../components/CardItem'
import { GeoBg } from '../components/GeoBg'
import { greetingCards } from '../data'
import styles from './Cards.module.css'

const occasions = ['All', ...Array.from(new Set(greetingCards.map(c => c.occasion))).sort()]

export const Cards: React.FC = () => {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? greetingCards
    : greetingCards.filter(c => c.occasion === active)

  return (
    <div className="page-enter">

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <GeoBg variant="circuit" opacity={0.12} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.heroLabel}>
              <span className={styles.heroLine} />
              Creative Work
            </span>
            <h1 className={styles.heroTitle}>
              Digital<br />
              <span className={styles.accent}>Greeting Cards</span>
            </h1>
            <p className={styles.heroSub}>
              Interactive, animated, and fully coded greeting cards — each one a small
              piece of creative engineering. No templates, no stock art. Pure web magic.
            </p>
          </div>

          {/* Decorative card stack */}
          <div className={styles.cardStack} aria-hidden>
            {greetingCards.slice(0, 3).map((card, i) => (
              <div
                key={card.id}
                className={styles.stackCard}
                style={{
                  transform: `rotate(${(i - 1) * 6}deg) translateY(${i * -8}px)`,
                  zIndex: 3 - i,
                }}
              >
                <img src={card.previewUrl} alt="" />
              </div>
            ))}
          </div>
        </div>
        <svg className={styles.divider} viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden>
          <path d="M0 48 L720 0 L1440 48 Z" fill="var(--white)"/>
        </svg>
      </section>

      {/* ── Filter tabs ── */}
      <section className={styles.tabs}>
        <div className={`container ${styles.tabsInner}`}>
          {occasions.map(occ => (
            <button
              key={occ}
              className={`${styles.tab} ${active === occ ? styles.tabActive : ''}`}
              onClick={() => setActive(occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cards grid ── */}
      <section className={`section ${styles.cardsSection}`}>
        <div className="container">
          <div className={styles.grid}>
            {filtered.map(card => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom card CTA ── */}
      <section className={styles.customCta}>
        <div className={`container ${styles.customCtaInner}`}>
          <div className={styles.customCtaIcon} aria-hidden>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.customCtaTitle}>Want a custom card?</h3>
            <p className={styles.customCtaDesc}>
              I build bespoke digital greeting cards for any occasion. Get in touch
              and we'll create something unforgettable.
            </p>
          </div>
          <a href="/contact" className={styles.customCtaBtn}>
            Commission a Card
          </a>
        </div>
      </section>

    </div>
  )
}
