import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator, createMaterialTopTabNavigator,StackActions } from 'react-navigation'
import Signup from '../Components/Signup'
import Login from '../Components/Login'
import Loading from '../Components/Loading'
import UserProfile from '../Components/UserProfile'
import ForgotPwd from '../Components/ForgotPwd'
import Playlist from '../Components/Playlist/Playlist'
import Event from '../Components/Event/Event'
import EventDetail from '../Components/Event/EventDetail'
import ModifUser from '../Components/User_actions/ModifyUserInfo'
import CreatePlaylist from '../Components/User_actions/CreatePlaylist'
import CreateEvent from '../Components/User_actions/CreateEvent'
import UserPlaylist from '../Components/User_actions/UserPlaylist'
import PlaylistDetail from '../Components/Playlist/PlaylistDetail'
import Search from '../Components/User_actions/SearchSong'
import SearchUser from '../Components/User_actions/SearchUser'
import SearchUserProfil from '../Components/UserSearch/SearchUserProfil'
import AddPlaylist from '../Components/Playlist/AddPlaylist'
import AddEvent from '../Components/Event/AddEvent'
import authDezzer from '../Components/User_actions/authDeezer'
import ArtistPage from '../Components/User_actions/Artist/ArtistPage'
import { TabBar } from '../Components/TabBar/TabBar'

const PlaylistPrivPub = createMaterialTopTabNavigator({
    PlaylistPub: {
        screen: Playlist,
        navigationOptions: {
            title: 'Playlist Publique'
        }

    },
    PlaylistPriv: {
        screen: UserPlaylist,
        navigationOptions: {
            title: 'Mes Playlists'
        }

    }
},
    {
        tabBarOptions: {
            indicatorStyle: '#FFFFFF',
            activeBackgroundColor: '#000000',
            labelStyle: {
                fontSize: 15,
            },
            style: {
                backgroundColor: 'rgb(31,32,35)'
            }
        }
    })

const PlaylistNav = createStackNavigator({
    Playlist: {
        screen: PlaylistPrivPub,
        navigationOptions: {
            title: 'Playlist'
        }

    },
    PlaylistDetail: {
        screen: PlaylistDetail,
    },
    // PlaylistAddUser : {
    //     screen : PlaylistAddUser
    // }
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
    CreateEvent: {
        screen: CreateEvent,
    },
    Search: {
        screen: Search,
    },
    SearchUser: {
        screen: SearchUser,
    },
    SearchUserProfil : {
        screen : SearchUserProfil
    },
    AddPlaylist: {
        screen: AddPlaylist,
    },
    AddEvent: {
        screen: AddEvent
    },
    AuthDezzer :{
        screen : authDezzer
    },
    ArtistPage :{
        screen : ArtistPage
    },
    PlaylistDetailSearchUser: {
        screen: PlaylistDetail,
    },
}, {
        headerMode: 'none'
    })


const Music_nav = createMaterialTopTabNavigator(
    {
        Home: {
            screen: UserNav,
            navigationOptions: {
                title: 'Bibliothèque'
            }
        },
        Event: {
            screen: EventNav,
            navigationOptions: {
                title: 'Evènement'
            }
        },
        Playlist: {
            screen: PlaylistNav,
            navigationOptions: {
                title: 'Playlist'
            }

        }
    },
    {
        tabBarComponent: TabBar,
        tabBarPosition: 'bottom',
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

