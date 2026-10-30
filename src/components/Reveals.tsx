'use client';
import { useEffect } from 'react';

// Revelados por máscara (.rv) y la línea final bajo "Enviar consulta" (.end-line): se marcan .seen al entrar en pantalla.
export function Reveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    document.querySelectorAll('.rv, .end-line').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
