import { useEffect } from 'react';
import { isAuthenticated } from '../../services/application.service';
import { RouteProps, useNavigate } from 'react-router-dom';
import { getCurrentUserRole } from '../../services/authentication.service';
import Navbar from './NavigationBar';

type EncapsulatedComponentProps = {
    allowedRoles?: string[];
    includeNavbar?: boolean;
    authenticationRequired?: boolean;
    component: React.ComponentType<RouteProps>;
};

const EncapsulatedComponent: React.FC<EncapsulatedComponentProps & RouteProps> = ({ 
    allowedRoles, 
    includeNavbar = true,
    authenticationRequired = true,
    component: Component, 
    ...rest 
}) => {
    const navigate = useNavigate();

    useEffect(() => {
    if (!isAuthenticated() && authenticationRequired) {
        navigate('/login');
    } else if (allowedRoles) {
        const userRole = getCurrentUserRole();

        if (!allowedRoles?.includes(userRole || '')) {
            navigate('/unauthorized');
        }
    }
    }, [allowedRoles, authenticationRequired, navigate]);

    return (
        <>
            {includeNavbar && <Navbar />}
            <Component {...rest as RouteProps} />
        </>
    );
};
  
  export default EncapsulatedComponent;