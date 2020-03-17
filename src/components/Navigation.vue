<template>
    <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
    >
        <v-list dense>
            <template v-for="(item, i) in items">
                <v-row
                        v-if="item.heading"
                        :key="item.heading"
                        align="center"
                >
                    <v-col cols="6">
                        <v-subheader v-if="item.heading">
                            {{ item.heading }}
                        </v-subheader>
                    </v-col>
                </v-row>
                <v-divider
                        v-else-if="item.divider"
                        :key="i"
                        dark
                        class="my-4"
                />
                <v-list-group
                        v-else-if="item.children"
                        :key="item.text"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                            v-for="(child, i) in item.children"
                            :key="i"
                            link
                            :to="child.link"
                    >
                        <v-list-item-action v-if="child.icon">
                            <v-icon>{{ child.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ child.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-item
                        v-else
                        :key="item.text"
                        link
                        :to="item.link"
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "Navigation",
        props: ['drawer'],
        data: () => ({
            errorApi: null,
            branchesLoadingFromApi: true,
            items: [
                {
                    heading: 'Расписание'
                },
                {
                    divider: true
                },
                {
                    heading: 'Отчёты'
                },
                {
                    divider: true
                },
                {
                    heading: 'Управление'
                },
                {
                    divider: true
                },
            ],
        }),
        mounted () {
            this.getBranchesFromApi()
        },
        methods: {
            getBranchesFromApi () {
                this.$http
                    .get('http://arenda-zalov.u-bot.chat/api/branches')
                    .then(response => {
                        this.parseBranches(response.data.data)
                    })
                    .catch(error => {
                        console.log(error);
                        this.errorApi = true;
                    })
                    .finally(() => (this.branchesLoadingFromApi = false));
            },
            parseBranches (branches) {
                let self = this
                branches.forEach(function (item, index) {
                    const navigationObject = {
                        icon: 'mdi-chevron-up',
                        'icon-alt': 'mdi-chevron-down',
                        text: item.name,
                        model: false,
                        children: [],
                    }
                    item.rooms.forEach(function (roomItem) {
                        const roomObject = {
                            icon: 'date_range',
                            text: roomItem.room_name,
                            link: `/room/${roomItem.id}`,
                        }

                        return navigationObject.children.push(roomObject)
                    })
                    self.items.splice(index+1, 0, navigationObject)
                })
                console.log(self.items)
            },
        }
    }
</script>

<style scoped>
    #keep .v-navigation-drawer__border {
        display: none
    }
</style>