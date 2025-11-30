import React, { Suspense } from "react";
import Loading from "@/components/shared/Loading";

const Loadable = <P extends object>(
  Component: React.ComponentType<P>,
  vars?: { loadingClassname: string }
) => {
  const LoadableComponent: React.FC<P> = (props: P) => {
    return (
      <Suspense fallback={<Loading className={vars?.loadingClassname} />}>
        <Component {...props} />
      </Suspense>
    );
  };

  LoadableComponent.displayName = `Loadable(${
    Component.displayName || Component.name || "Component"
  })`;

  return LoadableComponent;
};

export default Loadable;
