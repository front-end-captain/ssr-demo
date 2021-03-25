import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { LubanPage } from "luban-ssr";

interface HomeInitProps {
  age: number;
}

const Home: LubanPage<RouteComponentProps<{ name: string }>, HomeInitProps> = ({ age }) => {
  return <h3>Home page, {age}</h3>;
};

Home.getInitialProps = () => {
  return new Promise<HomeInitProps>((resolve) => {
    setTimeout(() => {
      resolve({ age: 20 });
    }, 1000);
  });
};

export default Home;
