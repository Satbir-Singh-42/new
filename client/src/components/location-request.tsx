import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Shield, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { locationService, UserLocation, LocationError } from '@/lib/location-service';

interface LocationRequestProps {
  onLocationGranted: (location: UserLocation) => void;
  onLocationDenied: () => void;
  isOpen: boolean;
}

export function LocationRequest({ onLocationGranted, onLocationDenied, isOpen }: LocationRequestProps) {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(isOpen);

  useEffect(() => {
    setShowPermissionDialog(isOpen);
  }, [isOpen]);

  const handleLocationRequest = async () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      const location = await locationService.getCurrentLocation(true);
      onLocationGranted(location);
      setShowPermissionDialog(false);
    } catch (error: any) {
      setLocationError(error as LocationError);
      if (error.type === 'permission_denied') {
        onLocationDenied();
      }
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleSkip = () => {
    setShowPermissionDialog(false);
    onLocationDenied();
  };

  const getErrorMessage = (error: LocationError): string => {
    switch (error.type) {
      case 'permission_denied':
        return 'Location access was denied. Please enable location permissions in your browser settings to get localized energy data.';
      case 'position_unavailable':
        return 'Your location could not be determined. Please check your internet connection and try again.';
      case 'timeout':
        return 'Location request timed out. Please try again.';
      default:
        return 'An error occurred while getting your location. Please try again.';
    }
  };

  return (
    <Dialog open={showPermissionDialog} onOpenChange={() => {}}>
      <DialogContent className="mx-3 max-w-sm sm:max-w-md w-full p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950/90 to-slate-800 border border-blue-500/20 shadow-2xl backdrop-blur-xl rounded-2xl" data-testid="dialog-location-permission">
        <DialogHeader className="pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent" data-testid="text-dialog-title">
            Share Your Location
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2" data-testid="text-dialog-description">
            Get personalized energy trading and localized renewable data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/40 to-blue-800/30 rounded-xl border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-200">
                  Local Energy Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 rounded-xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-300">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-200">
                  Weather & Efficiency
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-900/40 to-violet-800/30 rounded-xl border border-violet-500/20 hover:border-violet-400/30 transition-all duration-300">
              <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-violet-200">
                  Privacy Protected
                </p>
              </div>
            </div>
          </div>

          {locationError && (
            <Alert className="border-red-500/30 bg-gradient-to-r from-red-950/50 to-red-900/40 rounded-xl" data-testid="alert-location-error">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 text-sm">
                {getErrorMessage(locationError)}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleLocationRequest}
              disabled={isRequestingLocation}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              data-testid="button-allow-location"
            >
              {isRequestingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3" />
                  <span>Getting Location...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-3" />
                  <span className="font-medium">Allow Location</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isRequestingLocation}
              className="w-full h-10 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
              data-testid="button-skip-location"
            >
              <span className="text-sm">Skip for Now</span>
            </Button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4" data-testid="text-privacy-note">
            Change in browser settings anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}