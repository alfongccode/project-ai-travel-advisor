import { useRef, useEffect } from 'react';
import './polaroidGallery.css';

function PolaroidGallery({ images=[] }) {
	const lightboxImageRef = useRef(null);
	const lightboxCaptionRef = useRef(null);
	const lightboxOverlayRef = useRef(null);
	const lightboxCloseRef = useRef(null);

	function openLightbox(imgEl) {
		lightboxImageRef.current.src = imgEl.src;
		lightboxImageRef.current.alt = imgEl.alt || '';
		const caption = imgEl.closest('figure')?.querySelector('figcaption');
		lightboxCaptionRef.current.textContent = caption ? caption.textContent : '';
		lightboxCaptionRef.current.style.display = caption ? '' : 'none';
		lightboxOverlayRef.current.classList.add('active');
		document.body.style.overflow = 'hidden';
		lightboxCloseRef.current.focus();
	}

	function closeLightbox() {
		lightboxOverlayRef.current.classList.remove('active');
		document.body.style.overflow = '';
		lightboxImageRef.current.src = '';
	}

	function handleTriggerClick(ev) {
		openLightbox(ev.currentTarget);
	}

	function handleTriggerKeyDown(ev) {
		if (ev.key === 'Enter' || ev.key === ' ') {
			ev.preventDefault();
			openLightbox(ev.currentTarget);
		}
	}

	function handleCloseClick() {
		closeLightbox();
	}

	function handleOverlayClick(ev) {
		if (ev.target === lightboxOverlayRef.current) {
			closeLightbox();
		}
	}

	useEffect(() => {
		function handleKeyDown(ev) {
			if (ev.key === 'Escape' && lightboxOverlayRef.current.classList.contains('active')) {
				closeLightbox();
			}
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

  return (
		<>
			<div class="photograph-gallery">
				{images.map(image => 
					<figure class="polaroid">
						<img
							src={image.url}
							alt={image.title}
							class="lightbox-trigger"
							tabindex="0"
							role="button"
							loading="lazy"
							decoding="async"
							width="150"
							height="110"
							onClick={handleTriggerClick}
							onKeyDown={handleTriggerKeyDown} />
							{image.title && <figcaption>{image.title}</figcaption>}
						</figure>)}
			</div>

			<div ref={lightboxOverlayRef} class="lightbox-overlay" id="lightbox-overlay" onClick={handleOverlayClick}>
				<button ref={lightboxCloseRef} type="button" class="lightbox-close" id="lightbox-close" aria-label="Close" onClick={handleCloseClick}>✕</button>
				<figure class="lightbox-frame">
						<img ref={lightboxImageRef} id="lightbox-image" src="" alt="" />
						<figcaption ref={lightboxCaptionRef} id="lightbox-caption"></figcaption>
				</figure>
			</div>
		</>
  )
}

export default PolaroidGallery
