import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sing up', href: '/auth/signup' },
    !currentUser && { label: 'Sing in', href: '/auth/signin' },
    currentUser && { label: 'Sing out', href: '/auth/signout' }
  ]
    // filter false ones away
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });
  console.log(currentUser)

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Motonet</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
