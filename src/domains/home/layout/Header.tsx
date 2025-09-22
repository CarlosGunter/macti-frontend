import styles from './Header.module.css';
import Image from 'next/image';
import Logo from '@/assets/images/logos/macti_logo.png';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link
      href="/"
      >
        <Image src={Logo} alt="MACTI Logo" />
      </Link>
      <Link href="/login" className={styles.login}>Iniciar sesión</Link>
    </header>
  );
}