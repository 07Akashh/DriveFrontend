import { Suspense } from "react";

const Loader = () => (
  <div className="loader">
    <div className="spinner w-8 h-8" />
  </div>
);

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
export default Loadable;    