import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import React from 'react'
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
import CreateEvent from '../Components/User_actions/CreateEvent'
import UserPlaylist from '../Components/User_actions/UserPlaylist'
import PlaylistDetail from '../Components/Playlist/PlaylistDetail'
import Search from '../Components/User_actions/SearchSong'
import AddPlaylist from '../Components/Playlist/AddPlaylist'
import AddEvent from '../Components/Event/AddEvent'
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
            title: 'Playlist Privée'
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
    CreateEvent: {
        screen: CreateEvent,
    },
    Search: {
        screen: Search,
    },
    AddPlaylist: {
        screen: AddPlaylist,
    },
    AddEvent: {
        screen: AddEvent
    },
    PlaylistDetailUser: {
        screen: PlaylistDetail,
    }
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

