import React, { useState, useRef, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';
import styles from './ShareButtons.module.css';

const ShareButtons = ({ url, title, description }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getShareTemplate = (platform) => {
    const hashtags = ['Voluntariat', 'HelpMate', 'FacemBine', 'Comunitate'];
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    
    switch (platform) {
      case 'facebook':
        return `🤝 Susțin acest proiect minunat de voluntariat!\n\n` +
               `${title}\n\n` +
               `${description ? description + '\n\n' : ''}` +
               `Alătură-te și tu pentru a face o diferență în comunitate! 💪\n\n` +
               `${hashtagString}`;
      
      case 'twitter':
        // Twitter has a 280 character limit
        const twitterDesc = description ? description.substring(0, 100) + '...' : '';
        return `🌟 ${title}\n\n` +
               `${twitterDesc}\n\n` +
               `Alătură-te nouă în această inițiativă! 🤝\n\n` +
               `${hashtagString}`;
      
      case 'linkedin':
        return `🌟 Proiect de voluntariat: ${title}\n\n` +
               `${description ? description + '\n\n' : ''}` +
               `Sunt mândru/ă să susțin această inițiativă care face o diferență reală în comunitatea noastră. ` +
               `Dacă vrei să te implici și tu, accesează link-ul de mai jos!\n\n` +
               `${hashtagString}`;
      
      default:
        return '';
    }
  };

  const handleShare = (platform) => {
    const shareTemplate = getShareTemplate(platform);
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareTemplate)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTemplate)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(shareTemplate)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowDropdown(false);
  };

  const copyLink = async () => {
    try {
      // Create a formatted message for copying
      const copyTemplate = 
        `${title}\n\n` +
        `${description || ''}\n\n` +
        `Accesează proiectul aici: ${url}\n\n` +
        `#Voluntariat #HelpMate #FacemBine #Comunitate`;
      
      await navigator.clipboard.writeText(copyTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    setShowDropdown(false);
  };

  return (
    <div className={styles.shareContainer}>
      <button 
        ref={buttonRef}
        className={styles.shareButton}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>

      {showDropdown && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <button onClick={() => handleShare('facebook')} className={styles.shareOption}>
            <Facebook size={20} />
            <span>Distribuie pe Facebook</span>
          </button>
          <button onClick={() => handleShare('twitter')} className={styles.shareOption}>
            <Twitter size={20} />
            <span>Distribuie pe Twitter</span>
          </button>
          <button onClick={() => handleShare('linkedin')} className={styles.shareOption}>
            <Linkedin size={20} />
            <span>Distribuie pe LinkedIn</span>
          </button>
          <button onClick={copyLink} className={styles.shareOption}>
            {copied ? <Check size={20} /> : <Link size={20} />}
            <span>{copied ? 'Link copiat!' : 'Copiază link-ul'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButtons; 