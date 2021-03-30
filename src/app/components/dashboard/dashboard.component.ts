import {Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {BoxesService} from '../../services/boxes.service';
import {ReportService} from '../../services/report.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../util/messages.utill';
import {ERROR_MESSAGE, SECOND} from '../../util/Config.utils';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    drawChartStrucutre = false;

    constructor(
        private _boxes: BoxesService,
        private _report: ReportService,
        private _router: Router
    ) {
    }

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });
        seq = 0;
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });
        seq2 = 0;
    };

    ngOnInit() {
        Swal.showLoading();
        this.setGraphics();
        setInterval(this.setGraphics.bind(this), SECOND * 60);
    }

    setGraphics() {
        console.log('Refresco gráficas');
        if (this._router['url'] === '/dashboard') {
            this._report.getGraphics().subscribe(
                response => {
                    console.log('GRAPHICS --> ', response);
                    Swal.close();
                    this.setGraphicsCallback(response['data']);
                },
                error => MessagesUtil.errorMessage(ERROR_MESSAGE),
            );
        }
    }

    setGraphicsCallback(data) {

        this.startAnimationForLineChart(new Chartist.Line('#dailySalesChart',
            {
                labels: data.week.label,
                series: [
                    data.week.value
                ]
            },
            {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
            })
        );

        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        this.startAnimationForBarChart(new Chartist.Line('#websiteViewsChart',
            {
                labels: data.district.label,
                series: [
                    data.district.value
                ]
            },
            {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
            }
        ));

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(new Chartist.Bar('#completedTasksChart', {
            labels: data.month.label,
            series: [
                data.month.value
            ]
        }, {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
        }, [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ]));

        this.startAnimationForLineChart(new Chartist.Line('#dayChart',
            {
                labels: data.hour.label,
                series: [
                    data.hour.value
                ]
            },
            {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
            }
        ));

        if (data.structure && data.structure.value[0] != 0) {
            this.drawChartStrucutre = true;
            this.startAnimationForLineChart(new Chartist.Line('#structureChart',
                {
                    labels: data.structure.label,
                    series: [
                        data.structure.value
                    ]
                },
                {
                    lineSmooth: Chartist.Interpolation.cardinal({
                        tension: 0
                    }),
                    low: 0,
                    high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
                }
            ));
        }

    }

}
