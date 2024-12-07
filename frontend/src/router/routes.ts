import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'main', component: () => import('pages/0MainPage.vue') },
      { path: 'input', component: () => import('pages/InputPage.vue') },
      { path: 'flash', component: () => import('pages/FlashPage.vue') },
      { path: 'learn', component: () => import('pages/LearnPage.vue') },
      { path: 'quiz', component: () => import('pages/QuizPage.vue') },
      { path: 'game', component: () => import('pages/Games/GamesPage.vue') },
      { path: 'mole', component: () => import('pages/Games/MolePage.vue') },
      { path: 'statistic', component: () => import('pages/StatisticPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'dictionary', component: () => import('pages/DictionaryPage.vue') },     

    ],
  },
  // Catch-all route for 404 errors
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
