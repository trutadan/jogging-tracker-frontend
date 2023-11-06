import { useEffect } from 'react';
import { isAuthenticated } from '../../services/application.service';
import { RouteProps, useNavigate } from 'react-router-dom';
import { getCurrentUserRole } from '../../services/authentication.service';
import Navbar from './NavigationBar';

type EncapsulatedComponentProps = {
    allowedRoles?: string[];
    includeNavbar?: boolean;
    component: React.ComponentType<any>;
};

const EncapsulatedComponent: React.FC<EncapsulatedComponentProps & RouteProps> = ({ 
    allowedRoles, 
    includeNavbar = true,
    component: Component, 
    ...rest 
}) => {
    const navigate = useNavigate();

    useEffect(() => {
    if (!isAuthenticated()) {
        navigate('/login');
    } else if (allowedRoles) {
        const userRole = getCurrentUserRole();

        if (!allowedRoles?.includes(userRole || '')) {
            navigate('/unauthorized');
        }
    }
    }, [navigate, allowedRoles]);

    return (
        <>
            {includeNavbar && <Navbar />}
            <Component {...rest} />
        </>
    );
};
  
  export default EncapsulatedComponent;