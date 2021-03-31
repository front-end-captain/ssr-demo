import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LubanPage } from "luban-ssr";

interface HomeInitProps {
  age: number;
}

const Home: LubanPage<RouteComponentProps<{ name: string }>, HomeInitProps> = ({ age }) => {
  const [count, setCount] = useState(1);

  return (
    <div>
      Home page, {age}
      <h4>{count}</h4> <button onClick={() => setCount(count + 1)}>count</button>
    </div>
  );
};

Home.getInitialProps = () => {
  return new Promise<HomeInitProps>((resolve) => {
    setTimeout(() => {
      resolve({ age: 20 });
    }, 1000);
  });
};

export default Home;
