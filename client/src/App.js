import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      message: '',
      first_name: '',
      last_name: '',
      email: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      activePage: 1,
      pages: 0,
      pageUsers: [],
      search: ''
    }
    this.createUser = this.createUser.bind(this);
    this.paginate = this.paginate.bind(this);
  }


componentDidMount() {
  this.fetchUsers();
}

fetchUsers() {
  axios.get('http://localhost:9000/api/users', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  }).then(res => {
    setTimeout(() => {
      this.setState({users: res.data.data, pages: Math.floor(res.data.data.length / 15), pageUsers: res.data.data.slice(0, 15)});
    }, 10);
  }).catch(er => {
    this.setState({message: 'Something went wrong retrieving users'});
    setTimeout(() => {
      this.setState({message: ''});
    }, 4000);
  })
}

deleteCustomer(user) {
  axios.delete(`http://localhost:9000/api/users/${user.customer_id}`, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: {
      customer_id: JSON.stringify(user.customer_id)
    }
  }).then(res => {
    this.setState({message: 'User deleted successfully'});
    setTimeout(() => {
      this.setState({message: ''});
    }, 3500);
    this.fetchUsers();
  }).catch(er => {
    this.setState({message: 'Something went wrong deleting ' + user.email});
    setTimeout(() => {
      this.setState({message: ''});
    }, 4000);
  })
}

createUser() {
  axios.post(`http://localhost:9000/api/users`, {...this.state, users: []}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

paginate(num) {
  let tot = 15 * num;

  if (num === 1) {
    tot = 0;
  }

  let pageUsers = this.state.users.slice(tot, tot + 15);
  console.log(pageUsers);
  this.setState({
    activePage: num,
    pageUsers
  })
}

  render() {
    return (
      <div className="home">
          <div className="modal-wrapper" style={{opacity: this.state.message ? '1' : '0', zIndex: this.state.message ? '5' : '-2'}}>
            <div className="modal-content">
              <div className="message">{this.state.message}</div>
              <div className="btn-wrapper">
                <div className="btn" onClick={() => this.setState({message: ''})}>Close</div>
              </div>
            </div>
          </div>
          <div className="add-user">
            <h3>Add User</h3>
            <input type="text" placeholder="First Name" value={this.state.first_name} onChange={e => this.setState({first_name: e.target.value})} />
            <input type="text" placeholder="Last Name" value={this.state.last_name} onChange={e => this.setState({last_name: e.target.value})} />
            <input type="text" placeholder="Email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
            <input type="text" placeholder="Phone" value={this.state.phone} onChange={e => this.setState({phone: e.target.value})} />
            <input type="text" placeholder="Address 1" value={this.state.address1} onChange={e => this.setState({address1: e.target.value})} />
            <input type="text" placeholder="City" value={this.state.city} onChange={e => this.setState({city: e.target.value})} />
            <input type="text" placeholder="Zip" value={this.state.zip} onChange={e => this.setState({zip: e.target.value})} />
            <input type="text" placeholder="State" value={this.state.state} onChange={e => this.setState({state: e.target.value})} />
            <input type="text" placeholder="Country ('US', 'CA')" value={this.state.country} onChange={e => this.setState({country: e.target.value})} />
            <button onClick={this.createUser}>Create user</button>
          </div>

          <input style={{margin: '30px 15px', fontSize: '1.2em'}} placeholder="Search by first / last name" value={this.state.search} onChange={e => this.setState({search: e.target.value})} />

          <div className="users" style={{height: '70vh', overflow: 'scroll'}}>
            {!this.state.search ? 
                        this.state.pageUsers.map((user, idx) => (
                          <div key={idx} className="user">
                            <div>{user.email}</div>
                            <div className="name">
                              <div>{user.first_name}</div>
                              <div>{user.last_name}</div>
                            </div>
                            <div>{user.address}</div>
                            <div>{user.city}</div>
                            <button onClick={() => this.deleteCustomer(user)}>Delete</button>
                          </div>
                        ))
            : <div>
                {this.state.users.filter(user => user.first_name.toLowerCase().includes(this.state.search.toLowerCase()) || user.last_name.toLowerCase().includes(this.state.search.toLowerCase())).map((user, idx) => (
                                          <div key={idx} className="user">
                                          <div>{user.email}</div>
                                          <div className="name">
                                            <div>{user.first_name}</div>
                                            <div>{user.last_name}</div>
                                          </div>
                                          <div>{user.address}</div>
                                          <div>{user.city}</div>
                                          <button onClick={() => this.deleteCustomer(user)}>Delete</button>
                                        </div>
                ))}
              </div>}
            <h1>Users</h1>
          </div>

            <h3>Change page</h3>
          <div className="pages" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {/* {[...Array(this.state.pages)].map((num, idx) => (
              <div onClick={() => this.paginate(idx + 1)} key={idx}>{idx + 1}</div>
            ))} */}
            <div onClick={() => this.paginate(1)}>{this.state.activePage - 1 > 1 ? '...1' : ''}</div>
            <div style={{margin: '0 10px'}} onClick={() => this.paginate(this.state.activePage - 1)}>{this.state.activePage > 1 ? this.state.activePage - 1 : ''}</div>
            <div style={{color: 'red', fontSize: '1.3em'}}>{this.state.activePage}</div>
            <div style={{margin: '0 10px'}} onClick={() => this.paginate(this.state.activePage + 1)}>{this.state.activePage === this.state.pages ? '' : this.state.activePage + 1}</div>
            <div onClick={() => this.paginate(this.state.pages)}>{this.state.activePage === this.state.pages ? '' : '...' + this.state.pages}</div>
          </div>

          <div></div>
      </div>
    )
  }
}

export default App;
