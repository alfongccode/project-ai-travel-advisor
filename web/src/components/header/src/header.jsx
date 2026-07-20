import './header.css';
import logo from '../resources/assets/logo.png';

function Header() {
  return (
		<div className="topbar">
				<div className="brand">
						<img className="brand-logo" src={logo} alt="Indiana travel & Co logo" />
						<div className="brand-text">
								<span className="brand-name">Indiana Travel Co.</span>
								<span className="brand-sub">"That belongs in a museum!"</span>
						</div>
				</div>
				<span className="brand-stamp">Est. 1936</span>
		</div>
  )
}

export default Header
