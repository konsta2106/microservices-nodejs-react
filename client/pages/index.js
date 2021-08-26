import axios from 'axios';
import buildClient from '../api/build-client';

// prop currentUser coming from buildCLient and getInitialProps function
const landing = ({ currentUser }) => {
  return currentUser ? (
    <h1>Hello, {currentUser.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

landing.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/current-user');
  return data;
};

export default landing;

/* 
This component function will be executed inside client server and it will fetch data directly from the client service, not from the browser.
To communicate between services in kubernetes, we can reach enter service name with the port as shown in the example.
landing.getInitialProps = async () => {
  let response = await axios.get('http://auth-srv:3000/api/users/current-user');
  return response.data
}

To reach ingress nginx service in different namespace 
use http://serviceName.namespace.svc.cluster.local -> http://ingress-nginx.ingress-nginx.svc.cluster.local
Another option : External NameService Kubernetes
*/
