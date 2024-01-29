import type { RouteRecordNormalized } from 'vue-router';

const modules = import.meta.glob('@/router/modules/*.ts', { eager: true });

console.log(modules, 'modules');

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

console.log(appRoutes, 'appRoutes');

export default appRoutes;
