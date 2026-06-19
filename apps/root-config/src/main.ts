import { registerApplication, start } from "single-spa";
import "./style.css";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

const routes = constructRoutes(
  document.querySelector("#single-spa-layout")!
);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    console.log(`Loading application: ${name}`);

    const fn = new Function("name", "return import(name)")
    console.log(`Fn ${name} is`, fn);

    console.log(`Fn ${name} content is`, fn(name));

    return fn(name);
  },
});

applications.forEach(registerApplication);

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
});

layoutEngine.activate();
start();
