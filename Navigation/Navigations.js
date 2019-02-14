import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import Signup from '../Components/Signup'
import Login from '../Components/Login'
import Loading from '../Components/Loading'
import UserProfile from '../Components/UserProfile'
import ForgotPwd from '../Components/ForgotPwd'
import Playlist from '../Components/Playlist'
import Event from '../Components/Event/Event'
import EventDetail from '../Components/Event/EventDetail'
import ModifUser from '../Components/User_actions/ModifyUserInfo'
import CreatePlaylist from '../Components/User_actions/CreatePlaylist'
import UserPlaylist from '../Components/User_actions/UserPlaylist'
import PlaylistDetail from '../Components/Playlist/PlaylistDetail'
import Search from '../Components/User_actions/SearchSong'
import AddPlaylist from '../Components/Playlist/AddPlaylist'
import AddEvent from '../Components/Event/AddEvent'

const PlaylistNav = createStackNavigator({
    Playlist: {
        screen: Playlist,
        navigationOptions: {
            title: 'Playlist'
        }

    },
    PlaylistDetailPub: {
        screen: PlaylistDetail,
    }
},
    {
        headerMode: 'none'
    })

const EventNav = createStackNavigator({
    Event: {
        screen: Event,
        navigationOptions: {
            title: 'Evenement'
        }

    },
    EventDetailPub: {
        screen: EventDetail,
    }
},
    {
        headerMode: 'none'
    })

const UserNav = createStackNavigator({
    UserProfil: {
        screen: UserProfile,
    },
    UserInfo: {
        screen: ModifUser,
    },
    CreatePlaylist: {
        screen: CreatePlaylist,
    },
    Search: {
        screen: Search,
    },
    AddPlaylist: {
        screen: AddPlaylist,
    },
    AddEvent: {
        screen : AddEvent
    },
    UserPlaylist: {
        screen: UserPlaylist,
    },
    PlaylistDetailUser: {
        screen: PlaylistDetail,
    }
}, {
        headerMode: 'none'
    })


const Music_nav = createBottomTabNavigator(
    {
        Home: {
            screen: UserNav,
            navigationOptions: {
                title: 'Bibliothèque'
            }
        },
        Playlist: {
            screen: PlaylistNav,
            navigationOptions: {
                title: 'Playlist'
            }

        },
        Event: {
            screen: EventNav,
            navigationOptions: {
                title: 'Evènement'
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#000000',
            labelStyle: {
                fontSize: 15,
            },
            style: {
                backgroundColor: 'rgb(31,32,35)'
            }
        }
    }
)


const Switch = createSwitchNavigator(
    {
        Signup: {
            screen: Signup
        },
        ForgotPwd: {
            screen: ForgotPwd
        },
        Login: {
            screen: Login
        },
        Loading: {
            screen: Loading
        },
        Main: {
            screen: Music_nav
        }
    },
    {
        initialRouteName: 'Loading'
    }
)



export default createAppContainer(Switch)

