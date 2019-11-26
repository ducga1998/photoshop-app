import React, { useMemo } from 'react';
import styled from 'styled-components';

import UserIcon from '../../static/img/ic_navbar/ic_user/ic_user.svg';
import AccountIcon from '../../static/img/ic_navbar/ic_account/ic_account.svg';
import OrderIcon from '../../static/img/ic_navbar/ic_order/ic_order.svg';
import AddressBookIcon from '../../static/img/ic_navbar/ic_address_book/ic_address_book.svg';
import NotificationIcon from '../../static/img/ic_navbar/ic_notification/ic_notification.svg';
import SupportIcon from '../../static/img/ic_navbar/ic_support/ic_support.svg';
import PrivacyIcon from '../../static/img/ic_navbar/ic_privacy/ic_privacy.svg';
import AuthIcon from '../../static/img/ic_navbar/ic_auth/ic_auth.svg';
import ArrowRightIcon from '../../static/img/ic_navbar/ic_arrow_right/ic_arrow_right.svg';

const Container = styled.div`
  height: 100%;
  width: 280px;
  position: fixed;
  z-index: 300;
  top: 0;
  left: ${props => (props.toggle ? 0 : -280)}px;
  background-color: #fff;
  overflow: hidden;
  transition: 0.3s;
`;

const Backdrop = styled.div`
  display: ${props => (props.toggle ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 200;
  background-color: #000;
  opacity: 0.2;
  transition: 0.3s;
`;

const HeaderNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 130px;
  margin-bottom: 10px;
  background-color: #494b4d;
  opacity: 0.7;
  color: #fff;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
`;

const Greeting = styled.div`
  font-size: 18px;
  font-weight: 900;
  margin: 10px 0px 5px;
`;

const UserName = styled.div`
  font-size: 14px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 10px;
  color: #4f4f4f;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    p {
      background: linear-gradient(90deg, #4568dc 0%, #b06ab3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

const MenuIcon = styled.img`
  width: 25px;
  height: 25px;
`;

const MenuContent = styled.div`
  display: flex;
  align-items: center;
`;

function MainNavbar({ toggle, toggleMenu }) {
  const menu = useMemo(() => {
    return [
      { id: 'account', onClick: '#', title: 'Account', icon: AccountIcon },
      {
        id: 'order-history',
        onClick: '#',
        title: 'Order History',
        icon: OrderIcon,
      },
      {
        id: 'address-book',
        onClick: '#',
        title: 'Address Book',
        icon: AddressBookIcon,
      },
      {
        id: 'notification',
        onClick: '#',
        title: 'Notification',
        icon: NotificationIcon,
      },
      {
        id: 'customer-support',
        onClick: '#',
        title: 'Customer Support',
        icon: SupportIcon,
      },
      {
        id: 'privacy-policy',
        onClick: '#',
        title: 'Privacy Policy',
        icon: PrivacyIcon,
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <Backdrop toggle={toggle} onClick={toggleMenu} />
      <Container toggle={toggle}>
        <HeaderNavContainer>
          <UserImage src={UserIcon} alt={''} />
          <Greeting>Welcome,</Greeting>
          <UserName>Emmanuel Emenike</UserName>
        </HeaderNavContainer>
        {menu.map(item => (
          <MenuItem key={item.id}>
            <MenuContent>
              <MenuIcon src={item.icon} alt={''} />
              <p style={{ marginLeft: '10px' }}>{item.title}</p>
            </MenuContent>
            <MenuIcon src={ArrowRightIcon} alt={''} />
          </MenuItem>
        ))}
        <MenuItem>
          <MenuContent>
            <MenuIcon src={AuthIcon} alt={''} />
            <p
              style={{ marginLeft: '10px', color: '#EC6D62', fontWeight: 600 }}>
              Logout
            </p>
          </MenuContent>
          <MenuIcon src={ArrowRightIcon} alt={''} />
        </MenuItem>
      </Container>
    </React.Fragment>
  );
}

export default MainNavbar;
