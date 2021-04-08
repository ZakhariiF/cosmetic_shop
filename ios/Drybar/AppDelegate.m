#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RadarSDK/RadarSDK.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLinkingManager.h>
#import <GoogleMaps/GoogleMaps.h>
#import "RNSplashScreen.h"
#import <mParticle-Apple-SDK/mParticle.h>
#import "mParticle.h"

#import "AppboyKit.h"
#import "AppboyReactUtils.h"

#import <UserNotifications/UNUserNotificationCenter.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

static void InitializeMParticle(UIApplication *application) {
  MParticleOptions *options = [MParticleOptions optionsWithKey:@"dd175017c5a79d41a0ff9ae26d07d475"
                                                        secret:@"WPSLFwjHsMZYPHdfJVF9DynK4avgH-3Jdw0z94pAnvyGQabNBrk8yH0H9Tn2j2H4"];

  options.environment = MPEnvironmentDevelopment;
  
  options.logLevel = MPILogLevelVerbose;
  
  [[MParticle sharedInstance] startWithOptions:options];

}

static void InitializeBraze(UIApplication *application, NSDictionary *launchOptions) {
//  [Appboy startWithApiKey:@"477e66f0-4e5d-42f3-b493-b94de61db5ac"
  [Appboy startWithApiKey:@"41f00c7a-d4f1-489a-af22-c0e0b91e9982"
              inApplication:application
          withLaunchOptions:launchOptions
          withAppboyOptions:@{ ABKInAppMessageControllerDelegateKey : application }];
  
  
  // Register for user notifications
  if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_9_x_Max) {
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = application;
    UNAuthorizationOptions options = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    if (@available(iOS 12.0, *)) {
      options = options | UNAuthorizationOptionProvisional;
    }
    [center requestAuthorizationWithOptions:(options)
                          completionHandler:^(BOOL granted, NSError *_Nullable error) {
                            NSLog(@"Permission granted.");
                            [[Appboy sharedInstance] pushAuthorizationFromUserNotificationCenter:granted];
                          }];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  } else if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_7_1) {
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeAlert | UIUserNotificationTypeSound) categories:nil];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  } else {
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
     (UIRemoteNotificationTypeAlert |
      UIRemoteNotificationTypeBadge |
      UIRemoteNotificationTypeSound)];
  }

  [[AppboyReactUtils sharedInstance] populateInitialUrlFromLaunchOptions:launchOptions];

  // In-App Messaging
  [Appboy sharedInstance].inAppMessageController.delegate = application;
  
}

@implementation AppDelegate

@synthesize bridge;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyCI8V2hqQehtgQjoXW51kKuMibchXwlD4M"];
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  
  InitializeMParticle(application);
  
  InitializeBraze(application, launchOptions);
  
  [Radar initializeWithPublishableKey:@"prj_test_pk_5cd967ae3386d2ef739928d63e434350ef07e822"];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Drybar"
                                            initialProperties:nil];
  self.bridge = bridge;

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}


- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  [[Appboy sharedInstance] registerApplication:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  [[Appboy sharedInstance] userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [[Appboy sharedInstance] registerApplication:application didReceiveRemoteNotification:userInfo];
}

- (void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [[Appboy sharedInstance] registerDeviceToken:deviceToken];
}

- (void)awakeFromNib {
    [super awakeFromNib];

    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    [notificationCenter addObserver:self
                           selector:@selector(handleKitDidBecomeActive:)
                               name:mParticleKitDidBecomeActiveNotification
                             object:nil];

    [notificationCenter addObserver:self
                           selector:@selector(handleKitDidBecomeInactive:)
                               name:mParticleKitDidBecomeInactiveNotification
                             object:nil];
}

- (void)dealloc {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    [notificationCenter removeObserver:self
                                  name:mParticleKitDidBecomeActiveNotification
                                object:nil];

    [notificationCenter removeObserver:self
                                  name:mParticleKitDidBecomeInactiveNotification
                                object:nil];
}

- (void)handleKitDidBecomeActive:(NSNotification *)notification {
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *kitNumber = userInfo[mParticleKitInstanceKey];
    MPKitInstance kitInstance = (MPKitInstance)[kitNumber integerValue];

    if (kitInstance == MPKitInstanceAppboy) {
        NSLog(@"Appboy is available for use.");
    }
}

- (void)handleKitDidBecomeInactive:(NSNotification *)notification {
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *kitNumber = userInfo[mParticleKitInstanceKey];
    MPKitInstance kitInstance = (MPKitInstance)[kitNumber integerValue];

    if (kitInstance == MPKitInstanceAppboy) {
        NSLog(@"Appboy is unavailable for use.");
    }
}


// Deep linking
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  NSLog(@"Calling RCTLinkingManager with url %@", url);
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

// Universal links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *_Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

// In-app messaging
- (ABKInAppMessageDisplayChoice) beforeInAppMessageDisplayed:(ABKInAppMessage *)inAppMessage {
  NSLog(@"Received IAM from Braze in beforeInAppMessageDisplayed delegate.");
  NSData *inAppMessageData = [inAppMessage serializeToData];
  NSString *inAppMessageString = [[NSString alloc] initWithData:inAppMessageData encoding:NSUTF8StringEncoding];
  NSDictionary *arguments = @{
    @"inAppMessage" : inAppMessageString
  };
  [self.bridge.eventDispatcher
             sendDeviceEventWithName:@"inAppMessageReceived"
             body:arguments];
  // Note: return ABKDiscardInAppMessage if you would like
  // to prevent the Braze SDK from displaying the message natively.
  return ABKDisplayInAppMessageNow;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
