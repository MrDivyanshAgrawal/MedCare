import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12 flex flex-col justify-center items-center">
        <LoginForm />
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Login;
