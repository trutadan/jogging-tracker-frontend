import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { getCurrentUsername, logout } from "../../services/authentication.service";
import { isAdmin, isRegularUser, isUserManager } from "../../services/application.service";
import logo from "../../assets/images/logo.png";

const CenterContent = () => {
    if (!getCurrentUsername()) {
      return null;
    }
  
    const entriesLink = (
      <Link to="/entries" style={{ textDecoration: "none", color: "white", marginRight: "50px" }}>
        My Entries
      </Link>
    );
    const usersLink = (
      <Link to="/users" style={{ textDecoration: "none", color: "white", marginRight: "50px" }}>
        Users
      </Link>
    );
    const allEntriesLink = (
      <Link to="/entries/admin" style={{ textDecoration: "none", color: "white", marginRight: "50px" }}>
        All Entries
      </Link>
    );
  
    if (isRegularUser()) {
      return entriesLink;
    } else if (isUserManager()) {
      return (
        <div>
          {entriesLink}
          {usersLink}
        </div>
      );
    } else if (isAdmin()) {
      return (
        <div>
          {entriesLink}
          {usersLink}
          {allEntriesLink}
        </div>
      );
    }
    return null;
  };

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | EventTarget & Element>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black" }} style={{ top: 0 }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <img src={logo} alt="Your Logo" style={{ width: "50px" }} />
          </Link>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CenterContent />
        </div>
        <div>
          {getCurrentUsername() ? (
            <div style={{ display: "flex" }}>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {getCurrentUsername()}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
