import React from 'react'
import { Tag } from './Tag'
import type { GreetingCard } from '../types'
import styles from './CardItem.module.css'
import { Link    } from 'react-router-dom';

interface Props {
  card: GreetingCard
}

export const CardItem: React.FC<Props> = ({ card }) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={card.previewUrl} alt={card.title} loading="lazy" />
        <div className={styles.occasion}>
          <span>{card.occasion}</span>
        </div>
        <div className={styles.overlay}>
          {card.liveUrl && (
            < Link to={card.liveUrl} id={card.id} className={ styles.viewBtn }>
                View Card
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            /*<a href={card.liveUrl} target="_blank" rel="noreferrer" className={styles.viewBtn}>
              View Card
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>*/
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={`mono ${styles.year}`}>{card.year}</span>
        </div>
        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.desc}>{card.description}</p>
        <div className={styles.tags}>
          {card.tags.map(t => <Tag key={t} label={t} variant="orange" />)}
        </div>
      </div>
    </article>
  )
}
