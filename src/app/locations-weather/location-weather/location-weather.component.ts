import {Component, Input, OnInit} from '@angular/core';
import {City} from '../../models/city.model';
import {LocationWeatherService} from '../../services/location-weather.service';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-location-weather',
  templateUrl: './location-weather.component.html',
  styleUrls: ['./location-weather.component.scss']
})
export class LocationWeatherComponent implements OnInit{
  @Input('cityData') cityData: City
  cityCurrentWeather: any;
  forcastData: any;
  constructor(private locationWeatherService: LocationWeatherService) { }

  ngOnInit() {
    this.fetchCurrentWeatherForLocation();
    this.fetchLocationForcast();
  }

  handleMockData(payload: any): any{
    if (environment.useMockData) {
      return payload.filter((dataObject: any) => dataObject.cityKey === this.cityData.Key)[0];
    }
    else {
      return payload;
    }
  }
  fetchLocationForcast() {
    this.locationWeatherService.getForcastForLocation(this.cityData.Key).subscribe((forcastData) => {
      this.forcastData = this.handleMockData(forcastData);
    },(error) => this.locationWeatherService.emitError(error))
  }
  fetchCurrentWeatherForLocation() {
    this.locationWeatherService.getCurrentWeatherForLocation(this.cityData.Key).subscribe((cityCurrentWeather) => {
      if (!environment.useMockData) {
        this.cityCurrentWeather = this.handleMockData(cityCurrentWeather)[0];
      } else {
        this.cityCurrentWeather = this.handleMockData(cityCurrentWeather);
      }
      if (this.cityCurrentWeather) {
        this.cityCurrentWeather.countryId = this.cityData.Country.ID;
        this.cityCurrentWeather.cityName = this.cityData.LocalizedName;
      }
    },(error => this.locationWeatherService.emitError(error)))
  }
}
