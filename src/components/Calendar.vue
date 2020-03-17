<template>
    <v-row class="fill-height">
        <v-overlay
                :value="eventsLoadingFromApi"
                :absolute=true
        >
            <v-col class="text-center">
                <v-progress-circular
                        :size="70"
                        :width="7"
                         indeterminate
                         color="primary"
                ></v-progress-circular>
            </v-col>
        </v-overlay>
        <v-col>
            <v-sheet height="64">
                <v-toolbar flat color="white">
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                        Сегодня
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                        <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                        <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="refresh">
                        Обновить
                    </v-btn>
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="addEvent">
                        Добавить запись
                    </v-btn>
                    <v-menu bottom right>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    outlined
                                    color="grey darken-2"
                                    v-on="on"
                            >
                                <span>{{ typeToLabel[type] }}</span>
                                <v-icon right>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>День</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Неделя</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
                <v-calendar
                        ref="calendar"
                        v-model="focus"
                        color="primary"
                        :events="events"
                        :event-color="getEventColor"
                        :now="getToday(true)"
                        :type="type"
                        :interval-minutes="30"
                        :short-intervals=false
                        :first-interval="14"
                        :interval-count="34"
                        :interval-height="25"
                        :weekdays="weekdays"
                        @click:event="showEvent"
                        @click:more="viewDay"
                        @click:date="viewDay"
                        @click:time="addEvent"
                        @change="updateRange"
                ></v-calendar>
                <v-dialog
                        v-model="selectedOpen"
                        :close-on-content-click="false"
                        :activator="selectedElement"
                        offset-x
                        max-width="600"
                >
                    <v-card
                            color="grey lighten-4"
                            min-width="350px"
                            flat
                    >
                        <v-toolbar
                                :color="selectedEvent.color"
                                dark
                        >
                            <v-btn icon>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-toolbar-title>Запись</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn v-if="selectedEvent.id > 0" icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-col class="d-flex" cols="12" sm="12">
<!--                                <v-icon-->

<!--                                >-->
<!--                                    access_time-->
<!--                                </v-icon>-->
<!--                                <v-spacer></v-spacer>-->
                                <v-menu
                                        ref="menu"
                                        v-model="selectedEventDate"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="selectedEvent.dateString"
                                                label="Дата"
                                                persistent-hint
                                                prepend-icon="event"
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-model="selectedEvent.date"
                                            no-title
                                            @input="changeDatePicker"
                                    >
                                    </v-date-picker>
                                </v-menu>
<!--                                <v-btn-->
<!--                                    class="time-btn"-->
<!--                                >-->
<!--                                    {{ selectedEvent.dateString }}-->
<!--                                </v-btn>-->
                                <v-spacer></v-spacer>
                                <v-select
                                        v-model="selectedEvent.timeFrom"
                                        class="select-time"
                                        :items="generationTime"
                                        label="Начало"
                                        @change="changeSelectTimeFrom"
                                ></v-select>
                                <v-spacer></v-spacer>
                                <v-select
                                        v-model="selectedEvent.duration"
                                        class="select-time"
                                        :items="generationTimeDuration"
                                        label="Длительность"
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="12">
<!--                                <v-autocomplete-->
<!--                                        v-model="selectedEvent.client"-->
<!--                                        :items="selectedEventClients"-->
<!--                                        :filter="filterClients"-->
<!--                                        :loading="selectedEventClientLoading"-->
<!--                                        :search-input.sync="searchClients"-->
<!--                                        color="primary"-->
<!--                                        hide-no-data-->
<!--                                        hide-selected-->
<!--                                        label="Клиент"-->
<!--                                        :item-text="itemText"-->
<!--                                        placeholder="Введите Имя и Фамилию клиента"-->
<!--                                        no-data-text="Введите Имя и Фамилию клиента"-->
<!--                                        prepend-icon="supervised_user_circle"-->
<!--                                        return-object-->
<!--                                ></v-autocomplete>-->
                                <v-combobox
                                        v-model="selectedEvent.client"
                                        :items="selectedEventClients"
                                        :filter="filterClients"
                                        :search-input.sync="searchClients"
                                        :loading="selectedEventClientLoading"
                                        :item-text="itemText"
                                        prepend-icon="supervised_user_circle"
                                        placeholder="Введите Имя и Фамилию клиента"
                                        label="Клиент"
                                        clearable
                                        persistent-hint="true"
                                        hint="Выберите имя клиента или введите имя нового"
                                        chips
                                ></v-combobox>
                            </v-col>
                        </v-card-text>
<!--                        <v-dialog-->
<!--                                v-model="timePicker"-->
<!--                                max-width="300"-->
<!--                        >-->
<!--                            <v-time-picker-->
<!--                                    format="24hr"-->
<!--                                    max="23:00"-->
<!--                                    min="7:00"-->
<!--                                    :allowed-minutes="allowedStep"-->
<!--                                    scrollable="true"-->
<!--                            ></v-time-picker>-->
<!--                        </v-dialog>-->
                        <v-card-actions>
                            <v-btn
                                    raised
                                    color="primary"
                                    :loading="saving"
                                    :disabled="saving"
                                    @click="savingEvent"
                            >
                                Сохранить
                            </v-btn>
                            <v-btn
                                    reised
                                    color="secondary"
                                    @click="selectedOpen = false"
                            >
                                Закрыть
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "Calendar",
        data: () => ({
            focus: '',
            type: 'week',
            typeToLabel: {
                month: 'Month',
                week: 'Неделя',
                day: 'День',
                '4day': '4 Days',
            },
            start: null,
            end: null,
            selectedEvent: {},
            selectedEventName: '',
            selectedEventDate: false,
            selectedElement: null,
            selectedEventClients: [],
            selectedEventClient: null,
            selectedEventClientLoading: false,
            searchClients: null,
            selectedOpen: false,
            addEventOpen: false,
            timePicker: false,
            timeWorkFrom: 7,
            timeWorkTo: 23,
            saving: false,
            loader: null,
            eventsLoadingFromApi: true,
            eventsFromApi: null,
            errorApi: null,
            allowedWorkMinutes: ['00', '30'],
            generationTimeDuration: [
                '0:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00'
            ],
            weekdays: [1,2,3,4,5,6,0],
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
        }),
        created() {
            this.$vuetify.lang.current = 'ru'
        },
        mounted () {
            this.$refs.calendar.checkChange()
            this.getEventsFromApi ()
        },
        watch: {
            $route() {
                this.refresh()
            },
            searchClients (val) {
                if (val.length < 3) return;

                // Items have already been requested
                if (this.selectedEventClientLoading) return;

                this.selectedEventClientLoading = true

                // Lazily load input items
                this.$http
                    .get('http://arenda-zalov.u-bot.chat/api/clients?search=' + val)
                    .then(res => {
                        this.selectedEventClients = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.selectedEventClientLoading = false))
            },
        },
        computed: {
            title () {
                const { start, end } = this
                if (!start || !end) {
                    return ''
                }

                const startMonth = this.monthFormatter(start)
                const endMonth = this.monthFormatter(end)
                const suffixMonth = startMonth === endMonth ? startMonth : endMonth

                const startYear = start.year

                const startDay = start.day
                const endDay = end.day

                switch (this.type) {
                    case 'month':
                        return `${startMonth} ${startYear}`
                    case 'week':
                    case '4day':
                        return `${startDay} ${startMonth} - ${endDay} ${suffixMonth}`
                    case 'day':
                        return `${startMonth} ${startDay} ${startYear}`
                }
                return ''
            },
            monthFormatter () {
                return this.$refs.calendar.getFormatter({
                    timeZone: 'UTC', month: 'long',
                })
            },
            generationTime () {
                let timeWorkArray = []
                for (let i=this.timeWorkFrom; i<=this.timeWorkTo; i++) {
                    this.allowedWorkMinutes.forEach(function(item) {
                        timeWorkArray.push(`${i}:${item}`)
                    })
                }
                return timeWorkArray
            },
        },
        methods: {
            getEventsFromApi () {
                this.$http
                    .get('http://arenda-zalov.u-bot.chat/api/calendars?room=' + this.$route.params.room)
                    .then(response => {
                        this.eventsFromApi = response.data;
                        this.events = []
                        this.parseEvents(response.data.data)
                    })
                    .catch(error => {
                        console.log(error);
                        this.errorApi = true;
                    })
                    .finally(() => (this.eventsLoadingFromApi = false));
            },
            viewDay ({ date }) {
                this.focus = date
                this.type = 'day'
            },
            getEventColor (event) {
                return event.color
            },
            getToday (getString) {
                if (getString === true) {
                    return this.formatDate(new Date())
                } else {
                    return new Date()
                }
            },
            setToday () {
                this.focus = this.today
            },
            prev () {
                this.$refs.calendar.prev()
            },
            next () {
                this.$refs.calendar.next()
            },
            refresh () {
                this.eventsLoadingFromApi = true
                this.getEventsFromApi ()
            },
            getObjectDate (date, time, localString) {
                let dateString
                if (date != null) {
                    dateString = `${date} ${time}`
                } else {
                    dateString = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
                }

                let objectDate
                if (!localString) {
                    objectDate = new Date(dateString)
                } else {
                    objectDate = new Date(dateString).toLocaleString('ru', {day: 'numeric', year: 'numeric', month:'long'})
                }

                return objectDate
            },
            showEvent ({ nativeEvent, event }) {
                const start = new Date(event.start)
                const end = new Date(event.end)
                const date = `${this.formatDate(start)}`
                const time = `${start.getHours()}:${start.getMinutes()}`

                const objectDate = this.getObjectDate(date, time, false)
                const objectDateString = this.getObjectDate(date, time, true)

                const duration = end.getTime() - start.getTime()

                const open = () => {
                    this.selectedEvent = event
                    this.selectedEvent.date = this.formatDate(new Date(objectDate)),
                    this.selectedEvent.dateString = objectDateString
                    this.selectedEvent.timeFrom = this.formatTime(objectDate)
                    this.selectedEvent.duration = this.getDurationHours(duration)
                    // this.selectedElement = nativeEvent.target
                    setTimeout(() => this.selectedOpen = true, 10)

                }
                if (this.selectedOpen) {
                    this.selectedOpen = false
                    setTimeout(open, 10)
                } else {
                    open()
                }

                nativeEvent.stopPropagation()

                console.log(this.events)
                console.log(this.selectedEvent)
            },
            addEvent ({ date, time }) {
                let objectDate = this.getObjectDate(date, time, false)
                let objectDateString = this.getObjectDate(date, time, true)
                if (objectDate.getTime() < new Date().getTime()) return;
                const open = () => {
                    this.selectedEvent = {
                        id: 0,
                        color: 'grey darken-1',
                        name: this.selectedEventName,
                        dateString: objectDateString,
                        date: this.formatDate(new Date(objectDate)),
                        timeFrom: this.formatTime(objectDate),
                        duration: '1:00', //Добавили 1 час
                    }
                    setTimeout(() => this.selectedOpen = true, 10)
                }

                if (this.selectedOpen) {
                    this.selectedOpen = false
                    setTimeout(open, 10)
                } else {
                    open()
                }
            },
            changeSelectTimeFrom () {

            },
            savingEvent () {
                this.saving = !this.saving
                const start = new Date(`${this.selectedEvent.date} ${this.selectedEvent.timeFrom}`)
                this.selectedEvent.start = this.formatDate(start, true)
                this.selectedEvent.end = this.getEndEvent()
                console.log(this.selectedEvent)

                this.events.push(this.selectedEvent)

                this.selectedOpen = !this.selectedOpen
                this.selectedEvent = {}
                this.selectedEventClients = []
                this.saving = !this.saving
            },
            changeDatePicker (date) {
                this.selectedEventDate = false
                this.selectedEvent.dateString = new Date(date).toLocaleString('ru', {day: 'numeric', year: 'numeric', month:'long'})
                console.log(this.selectedEvent)
            },
            getDurationHours(time) {
                let hours = Math.floor((time / (1000 * 60 * 60)) % 24)
                let minutes = Math.floor((time / (1000 * 60)) % 60)

                if (minutes <= 30 && minutes > 0) {
                    minutes = "30"
                } else if (minutes > 30) {
                    minutes = "00"
                    hours = hours + 1
                } else {
                    minutes = "00"
                }

                return `${hours}:${minutes}`
            },
            getDurationMilliseconds (duration) {
                let timeStr = duration
                let res = timeStr.split(':')
                return +res[0]*60*60*1000+res[1]*60*1000
            },
            getEndEvent () {
                let durationMilliseconds = this.getDurationMilliseconds(this.selectedEvent.duration)
                const start = new Date(`${this.selectedEvent.date} ${this.selectedEvent.timeFrom}`)
                return this.formatDate(new Date(start.getTime() + durationMilliseconds), true)
            },
            formatTime (time) {
                let minutes = time.getMinutes()
                if (minutes >= 30 && minutes < 60) minutes = '30'
                else if (minutes >= 0 && minutes < 30) minutes = '00'
                return `${time.getHours()}:${minutes}`
            },
            updateRange ({ start, end }) {
                this.start = start
                this.end = end
            },
            formatDate (a, withTime) {
                return withTime
                    ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()!==0 ? a.getMinutes() : '00' }`
                    : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
            },
            parseEvents(ev) {
                const self = this
                ev.forEach(function (item) {
                    const eventObject = {
                        id: item.id,
                        name: '',
                        color: 'grey darken-1',
                        roomId: item.room_id,
                        start: self.formatDate(new Date(item.time_from), true),
                        end: self.formatDate(new Date(item.time_to), true),
                    }
                    self.events.push(eventObject)
                })
            },
            filterClients (item, queryText) {
                if (queryText < 3 ) return;
                const firstName = item.first_name.toLowerCase()
                const lastName = item.last_name.toLowerCase()
                const searchText = queryText.toLowerCase()

                return firstName.indexOf(searchText) > -1 ||
                    lastName.indexOf(searchText) > -1
            },
            itemText (item) {
                return `${item.first_name} ${item.last_name} ${item.middle_name}`
            },
        },
    }
</script>

<style scoped>
    .select-time {
        max-width: 130px;
    }
    .time-btn {
        margin-top: 12px;
    }

</style>