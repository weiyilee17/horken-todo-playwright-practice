import { ModeToggle } from './mode-toggle';

function Header() {
  return (
    <header className='flex justify-end items-center'>
      <h2 className='mx-auto text-2xl'>TODO</h2>
      <ModeToggle />
    </header>
  );
}

export default Header;
