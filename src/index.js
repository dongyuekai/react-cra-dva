import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'
import dva, { connect } from 'dva'
import { Router, Route } from 'dva/router'
import styles from './index.scss';
import key from 'keymaster';



// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const app = dva()
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return {
        ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1 };
    },
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'count/minus' });
    }
  },
  subscriptions: {
    keyboardWatcher(dispatch) {
      key('⌘+up, ctrl+up', () => { dispatch({ type: 'count/add' }) });
    },
  },
})
function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
const CountApp = ({ count, dispatch }) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={() => { dispatch({ type: 'count/add' }); }}>增加</button>
        <button onClick={() => { dispatch({ type: 'count/minus' }); }}>减少</button>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return { count: state.count };
}
const HomePage = connect(mapStateToProps)(CountApp);

app.router(({ history }) =>
  <Router history={history}>
    <Route path='/' component={HomePage} />
  </Router>
)
app.start('#root')


