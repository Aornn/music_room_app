import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import Signup from '../Components/Signup'
import Login from '../Components/Login'
import Loading from '../Components/Loading'
import UserProfile from '../Components/UserProfile'
import ForgotPwd from '../Components/ForgotPwd'
import Playlist from '../Components/Playlist'
import Event from '../Components/Event'
import ModifUser from '../Components/User_actions/ModifyUserInfo'
import CreatePlaylist from '../Components/User_actions/CreatePlaylist'
import PlaylistDetail from '../Components/Playlist/PlaylistDetail'
import Search from '../Components/User_actions/SearchSong'

const UserNav = createSwitchNavigator({
    UserProfil: {
        screen: UserProfile,
        navigationOptions: {
            title: 'Mon Compte'
        }
    },
    UserInfo: {
        screen: ModifUser,
        navigationOptions: {
            title: 'Modifier mes informations'
        }
    },
    CreatePlaylist: {
        screen: CreatePlaylist,
        navigationOptions: {
            title: 'Crée ta playlist'
        }
    },
    Search: {
        screen: Search,
    },
    PlaylistDetail: {
        screen: PlaylistDetail,
    }
},
    {
        headerMode: 'none'
    })


const Music_nav = createBottomTabNavigator(
    {
        Home: {
            screen: UserNav
        },
        Playlist: {
            screen: Playlist,
            navigationOptions: {
                title: 'Playlist'
            }

        },
        Event: {
            screen: Event,
            navigationOptions: {
                title: 'Evenement'
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#D3D3D3',
            labelStyle: {
                fontSize: 15,
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

