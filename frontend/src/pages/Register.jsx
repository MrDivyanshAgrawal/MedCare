import RegisterForm from '../components/RegisterForm';
import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12 flex flex-col justify-center items-center">
        <RegisterForm />
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Register;
