import { registerApplication, start } from "single-spa";
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
    return new Function("name", "return import(name)")(name);
  },
});

applications.forEach(registerApplication);

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
});

layoutEngine.activate();
start();
