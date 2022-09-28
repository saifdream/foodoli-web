import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import store, {persistor} from "./store";
import {history} from "./store/actions/history";
import * as serviceWorker from './serviceWorker';

/*ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter history={history} basename={'/'}>
              <App />
          </BrowserRouter>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);*/

class Root extends Component {
    render() {
        return (
            /*<React.StrictMode>*/
                <Provider store={store}>
                    {/*<PersistGate loading={<Typography>Loading ... </Typography>} persistor={persistor}>*/}
                    <BrowserRouter history={history} basename={'/'}>
                        <App />
                    </BrowserRouter>
                    {/*</PersistGate>*/}
                </Provider>
            /*</React.StrictMode>*/
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
