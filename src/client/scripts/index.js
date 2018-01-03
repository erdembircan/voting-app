import IndexController from './indexController';
import { setTimeout } from 'timers';

const indexController = new IndexController('#base');

const messageHolder = document.querySelector('[data-message]');
const errorHolder = document.querySelector('[data-error]');

const { message } = messageHolder.dataset;
const { error } = errorHolder.dataset;

if (message !== '') indexController.showToast(message);
if (error !== '') indexController.showToast(error);

